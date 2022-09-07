const php_path = () => {
  if (process.platform == "win32" && process.env.CI == "true") {
    return "c:\\tools\\php\\php.exe";
  }
  return "php";
}
const { execSync } = require("child_process");
execSync(`composer create-project laravel/laravel ${require("os").tmpdir}/ltest`);
try {
  let a = execSync(`${php_path()} src/main/tinker.php ${require("os").tmpdir}/ltest 'use Illuminate\\Foundation\\Inspiring;Inspiring::quote();'`);
  console.log("Here is an inspiring quote:");
  console.log(a.toString());
} catch (e) {
  console.error("Error in tinker.php");
  console.error(e.stdout.toString());
  process.exit(1);
}