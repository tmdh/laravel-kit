<?php
/*
    The MIT License (MIT)

    Copyright (c) 2012-2018 Justin Hileman

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
    OR OTHER DEALINGS IN THE SOFTWARE.

    The MIT License (MIT)

    Copyright (c) Spatie bvba <info@spatie.be>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
 */

require_once $argv[1] . '/vendor/autoload.php';
$app = require_once $argv[1] . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Application;
use Illuminate\Support\Collection;
use Laravel\Tinker\ClassAliasAutoloader;
use Psy\Configuration;
use Psy\ExecutionClosure;
use Psy\Shell;
use Psy\Exception\BreakException;
use Psy\Exception\ErrorException;
use Psy\Exception\ThrowUpException;
use Psy\Exception\TypeErrorException;
use Symfony\Component\Console\Output\BufferedOutput;

class KitExecutionLoopClosure extends ExecutionClosure
{
    /**
     * @param Shell $__psysh__
     */
    public function __construct(Shell $__psysh__)
    {
        $this->setClosure($__psysh__, function () use ($__psysh__) {
            // Restore execution scope variables
            \extract($__psysh__->getScopeVariables(false));

            // Removed while loop. This is the only change from Psy\ExecutionLoopClosure.

            $__psysh__->beforeLoop();

            try {
                $__psysh__->getInput();

                try {
                    // Pull in any new execution scope variables
                    if ($__psysh__->getLastExecSuccess()) {
                        \extract($__psysh__->getScopeVariablesDiff(\get_defined_vars()));
                    }

                    // Buffer stdout; we'll need it later
                    \ob_start([$__psysh__, 'writeStdout'], 1);

                    // Convert all errors to exceptions
                    \set_error_handler([$__psysh__, 'handleError']);

                    // Evaluate the current code buffer
                    $_ = eval($__psysh__->onExecute($__psysh__->flushCode() ?: ExecutionClosure::NOOP_INPUT));
                } catch (\Throwable $_e) {
                    // Clean up on our way out.
                    if (\ob_get_level() > 0) {
                        \ob_end_clean();
                    }

                    throw $_e;
                } catch (\Exception $_e) {
                    // Clean up on our way out.
                    if (\ob_get_level() > 0) {
                        \ob_end_clean();
                    }

                    throw $_e;
                } finally {
                    // Won't be needing this anymore
                    \restore_error_handler();
                }

                // Flush stdout (write to shell output, plus save to magic variable)
                \ob_end_flush();

                // Save execution scope variables for next time
                $__psysh__->setScopeVariables(\get_defined_vars());

                $__psysh__->writeReturnValue($_);
            } catch (BreakException $_e) {
                $__psysh__->writeException($_e);

                return;
            } catch (ThrowUpException $_e) {
                $__psysh__->writeException($_e);

                throw $_e;
            } catch (\TypeError $_e) {
                $__psysh__->writeException(TypeErrorException::fromTypeError($_e));
            } catch (\Error $_e) {
                $__psysh__->writeException(ErrorException::fromError($_e));
            } catch (\Exception $_e) {
                $__psysh__->writeException($_e);
            }

            $__psysh__->afterLoop();
        });
    }
} 

class Tinker
{
    /** @var \Symfony\Component\Console\Output\BufferedOutput */
    protected $output;

    /** @var \Psy\Shell */
    protected $shell;

    protected $projectDir;

    public function __construct(string $projectDir)
    {
        $this->output = new BufferedOutput();

        $this->shell = $this->createShell($this->output);

        $this->projectDir = $projectDir;
    }

    public function execute(string $phpCode): string
    {
        $phpCode = $this->removeComments($phpCode);
        
        $this->shell->addInput($phpCode);

        $closure = new KitExecutionLoopClosure($this->shell);

        $closure->execute();

        $output = $this->cleanOutput($this->output->fetch());

        return $output;
    }

    protected function createShell(BufferedOutput $output): Shell
    {
        $config = new Configuration([
            'updateCheck' => 'never',
            'usePcntl' => false,
            'interactiveMode' => Configuration::INTERACTIVE_MODE_DISABLED,
            'rawOutput' => true,
        ]);

        $config->setHistoryFile(defined('PHP_WINDOWS_VERSION_BUILD') ? 'null' : '/dev/null');

        $config->getPresenter()->addCasters([
            Collection::class => 'Laravel\Tinker\TinkerCaster::castCollection',
            Model::class => 'Laravel\Tinker\TinkerCaster::castModel',
            Application::class => 'Laravel\Tinker\TinkerCaster::castApplication',
        ]);

        $shell = new Shell($config);

        $shell->setOutput($output);

        $composerClassMap = $this->projectDir . 'vendor/composer/autoload_classmap.php';

        if (file_exists($composerClassMap)) {
            ClassAliasAutoloader::register($shell, $composerClassMap);
        }

        return $shell;
    }

    public function removeComments(string $code): string
    {
        $tokens = collect(token_get_all("<?php\n".$code.'?>'));

        return $tokens->reduce(function ($carry, $token) {
            if (is_string($token)) {
                return $carry.$token;
            }

            $text = $this->ignoreCommentsAndPhpTags($token);

            return $carry.$text;
        }, '');
    }

    protected function ignoreCommentsAndPhpTags(array $token)
    {
        [$id, $text] = $token;

        if ($id === T_COMMENT) {
            return '';
        }
        if ($id === T_DOC_COMMENT) {
            return '';
        }
        if ($id === T_OPEN_TAG) {
            return '';
        }
        if ($id === T_CLOSE_TAG) {
            return '';
        }

        return $text;
    }

    protected function cleanOutput(string $output): string
    {
        $output = preg_replace('/(?s)(<aside.*?<\/aside>)|Exit:  Ctrl\+D/ms', '$2', $output);

        return trim($output);
    }
}

$tinker = new Tinker($argv[1]);
echo $tinker->execute($argv[2]);
