import Vue from "vue";
import Vuex from "vuex";
import { execSync, spawn } from "child_process";
import { basename } from "path";
import kill from "tree-kill";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    project: null,
    name: null,
    dir: null,
    serve: null
  },
  mutations: {
    openProject(state, dir) {
      let output = artisan("list --format=json", dir);
      if (output.includes("Laravel")) {
        state.dir = dir;
        state.project = JSON.parse(output);
        state.name = basename(dir);
        document.title = `${state.name} - Kit`;
      }
    },
    updateLastArtisan(state, command) {
      state.lastArtisan = command;
    }
  },
  getters: {
    artisan: state => command => {
      return artisan(command, state.dir);
    }
  },
  actions: {
    serveService(context) {
      if (context.state.serve == null) {
        context.state.serve = spawn("php", ["artisan", "serve"], { cwd: context.state.dir });
      } else {
        kill(context.state.serve.pid, "SIGKILL", function(err) {
          if (err) {
            console.log(err);
          } else {
            context.state.serve = null;
          }
        });
      }
    }
  }
});

function artisan(command, dir) {
  return execSync(`php artisan ${command} --no-interaction --ansi`, { cwd: dir })
    .toString()
    .trim();
}
