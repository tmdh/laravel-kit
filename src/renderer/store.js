import Vue from "vue";
import Vuex from "vuex";
import { execSync } from "child_process";
const { basename } = require("path");

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    project: null,
    name: null,
    dir: null,
    lastArtisan: null
  },
  mutations: {
    openProject(state, dir) {
      let output = artisan("list --format=json", dir);
      if (output.includes("Laravel")) {
        state.dir = dir;
        state.project = JSON.parse(output);
        state.name = basename(dir);
      }
    }
  },
  getters: {
    artisan: state => command => {
      return artisan(command, state.dir);
    }
  },
  actions: {}
});

function artisan(command, dir) {
  return execSync(`php artisan ${command}`, { cwd: dir })
    .toString()
    .trim();
}
