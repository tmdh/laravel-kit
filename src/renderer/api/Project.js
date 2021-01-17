const { basename } = require("path");

export class Project {
  constructor(dir) {
    this.dir = dir;
    this.name = basename(dir);
  }
  fun() {
    return "Here's the fun!";
  }
}
