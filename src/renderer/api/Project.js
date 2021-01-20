const { basename } = require("path");
const { execSync } = require("child_process");

module.exports = class Project {
  constructor(dir) {
    this.dir = dir;
    this.name = basename(dir);
    this.reload();
  }
  artisan(command) {
    return execSync(`php artisan ${command} --no-interaction`, { cwd: this.dir })
      .toString()
      .trim();
  }
  list() {
    return JSON.parse(this.artisan("list --format=json"));
  }
  reload() {
    const listTemp = this.list();
    this.version = listTemp.application.version;
    const remove = ["serve", "tinker"];
    this.commands = listTemp.commands.filter(command => !remove.includes(command.name));
  }
};
