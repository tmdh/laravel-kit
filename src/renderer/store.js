import Vue from "vue";
import Vuex from "vuex";
import { execSync, exec } from "child_process";
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
      let output = execSync("php artisan list --format=json", { cwd: dir })
        .toString()
        .trim();
      if (output.includes("Laravel")) {
        state.dir = dir;
        state.project = JSON.parse(output);
        state.name = basename(dir);
        document.title = `${state.name} - Kit`;
      }
    },
    stopServeSync(state) {
      if (state.serve != null) {
        kill(state.serve.pid, "SIGKILL", function() {
          state.serve = null;
        });
      }
    }
  },
  actions: {
    startServe(context) {
      context.state.serve = exec("php artisan serve", { cwd: context.state.dir });
    },
    stopServe(context) {
      if (context.state.serve != null) {
        kill(context.state.serve.pid, "SIGKILL", function() {
          context.state.serve = null;
        });
      }
    }
  }
});
