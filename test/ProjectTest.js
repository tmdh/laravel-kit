/* eslint-disable no-undef */
const Project = require("../src/renderer/api/Project.js");
const { resolve } = require("path");
const { assert } = require("chai");

let p = new Project(resolve("laravel-app"));
describe("Project", function() {
  it("name should be correct", function() {
    assert.equal(p.name, "laravel-app");
  });
});

describe("Artisan", function() {
  it("version should be major.minor.patch", function() {
    assert.equal(p.version.split(".").length, 3);
  });
  it("commands number should be more", function() {
    assert.isAtLeast(p.commands.length, 20);
  });
});
