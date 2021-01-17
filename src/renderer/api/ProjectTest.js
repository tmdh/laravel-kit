const Project = require("./Project.js");
const { join } = require("path");

let p = new Project(join(__dirname, "laravel-app"));
console.log(p.artisan("list"));
