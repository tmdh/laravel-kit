/*

  MIT License

  Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

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
  
*/

import { sync } from "execa";
import stripAnsi from "strip-ansi";
const defaultShell = process.env.SHELL || "/bin/bash";

const args = ["-ilc", 'echo -n "_SHELL_ENV_DELIMITER_"; env; echo -n "_SHELL_ENV_DELIMITER_"; exit'];

const env = {
  // Disables Oh My Zsh auto-update thing that can block the process.
  DISABLE_AUTO_UPDATE: "true"
};

const parseEnv = (env: string) => {
  env = env.split("_SHELL_ENV_DELIMITER_")[1];
  const ret: Record<string, string> = {};

  for (const line of stripAnsi(env)
    .split("\n")
    .filter((line) => Boolean(line))) {
    const [key, ...values] = line.split("=");
    ret[key] = values.join("=");
  }

  return ret;
};

function shellEnv() {
  try {
    const { stdout } = sync(defaultShell, args, { env });
    return parseEnv(stdout);
  } catch (error) {
    return process.env;
  }
}

/**
 * Fixes environment variable to execute PHP from brew or others
 * @returns void
 */
export default function () {
  if (process.platform !== "darwin") {
    return;
  }
  process.env.PATH = shellEnv().PATH || ["/usr/local/bin", process.env.PATH].join(":");
}
