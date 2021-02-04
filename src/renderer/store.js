import Vue from "vue";
import Vuex from "vuex";
import { exec, spawn } from "child_process";
import { basename } from "path";
import kill from "tree-kill";
import { remote } from "electron";
const { dialog } = remote;

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    project: null,
    name: null,
    dir: null,
    serve: null,
    serveLink: null
  },
  mutations: {
    updateServeLink(state, link) {
      state.serveLink = link;
    },
    stopServeSync(state) {
      if (state.serve != null) {
        kill(state.serve.pid, "SIGKILL", function() {
          state.serve = null;
          state.serveLink = null;
        });
      }
    }
  },
  actions: {
    openProject(context, payload) {
      if (payload.reload == undefined) {
        context.dispatch("closeProject"); //notice
      }
      exec("php artisan list --format=json", { cwd: payload.dir }, (error, stdout) => {
        if (error) {
          dialog.showMessageBox(
            {
              type: "error",
              title: "Error",
              message: `${error}`,
              buttons: ["Learn more", "OK"]
            },
            buttonIndex => {
              console.log(buttonIndex);
            }
          );
        } else {
          if (stdout.includes("Laravel")) {
            context.state.dir = payload.dir;
            context.state.project = JSON.parse(stdout);
            context.state.name = basename(payload.dir);
            document.title = `${context.state.name} - Kit`;
          }
        }
      });
    },
    openDialog(context) {
      dialog
        .showOpenDialog({
          title: "Open project...",
          buttonLabel: "Open",
          properties: ["openDirectory"],
          multiSelections: false
        })
        .then(result => {
          if (!result.canceled) {
            context.dispatch("openProject", { dir: result.filePaths[0] });
          }
        });
    },
    closeProject({ state, dispatch }) {
      if (state.project != null) {
        state.project = null;
        state.name = null;
        state.dir = null;
        dispatch("stopServe");
      }
    },
    startServe({ state, commit }) {
      state.serve = spawn("php", ["artisan", "serve"], { cwd: state.dir });
      state.serve.stdout.setEncoding("utf-8");
      state.serve.stdout.on("data", data => {
        if (data.includes("started")) {
          commit("updateServeLink", data.match(/(https?:\/\/[a-zA-Z0-9.]+(:[0-9]+)?)/g)[0]);
        }
      });
    },
    stopServe({ state }) {
      if (state.serve != null) {
        kill(state.serve.pid, "SIGKILL", function() {
          state.serve = null;
          state.serveLink = null;
        });
      }
    }
  }
});
