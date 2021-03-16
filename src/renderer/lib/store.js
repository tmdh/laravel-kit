import Vue from "vue";
import Vuex from "vuex";
import { exec, spawn } from "child_process";
import { basename } from "path";
import kill from "tree-kill";
import { remote } from "electron";
const { dialog } = remote;
import Store from "electron-store";
import bus from "@/lib/bus.js";
const estore = new Store();

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    project: null,
    name: null,
    dir: null,
    serve: null,
    serveLink: null,
    recents: [],
    verbosity: 1,
    env: "",
    editor: "",
    opening: false,
    running: false,
    tinkering: false,
    dark: false,
    licensed: false,
    code: `// Write your tinker code here\nuse Illuminate\\Foundation\\Inspiring;\nInspiring::quote();`,
    output: "// The output is shown here",
    php: ""
  },
  mutations: {
    updateServeLink(state, link) {
      state.serveLink = link;
    },
    stopServeSync(state) {
      if (state.serve != null) {
        kill(state.serve.pid, "SIGKILL", function () {
          state.serve = null;
          state.serveLink = null;
        });
      }
    },
    getRecents(state) {
      state.recents = estore.get("recents");
    },
    addRecent(state, dir) {
      let newRecents = estore.get("recents").filter((item) => item != dir);
      newRecents.unshift(dir);
      estore.set("recents", newRecents);
      state.recents = estore.get("recents");
      bus.$emit("getRecents");
    },
    clearRecents(state) {
      estore.set("recents", []);
      state.recents = estore.get("recents");
    },
    updateSettingsState(state) {
      state.verbosity = estore.get("verbosity");
      state.env = estore.get("env");
      state.editor = estore.get("editor");
      state.dark = estore.get("dark");
      state.php = estore.get("php");
    }
  },
  actions: {
    openProject(context, payload) {
      if (context.state.php !== "") {
        if (payload.reload == undefined) {
          context.dispatch("closeProject");
        }
        context.state.opening = true;
        exec(`"${context.state.php}" artisan --format=json`, { cwd: payload.dir }, (error, stdout) => {
          if (error) {
            let message = stdout.length > 0 ? stdout : `${error}`;
            if (stdout.includes("Could not open input file: artisan")) {
              message = `${payload.dir} - This folder is not a Laravel project. Please create a Laravel project and then open it.`;
            }
            dialog.showMessageBox({
              type: "error",
              title: "Error",
              message
            });
            context.state.opening = false;
          } else {
            if (stdout.includes("Laravel")) {
              context.state.dir = payload.dir;
              context.state.project = JSON.parse(stdout);
              context.state.project.namespaces = null;
              context.state.name = basename(payload.dir);
              document.title = `${context.state.name} - Kit`;
              context.commit("addRecent", payload.dir);
            }
            context.state.opening = false;
          }
        });
      } else {
        dialog.showErrorBox("Error", "php executable not found.\r\nGo to Settings and choose an executable.");
      }
    },
    openDialog(context) {
      dialog
        .showOpenDialog({
          title: "Open project...",
          buttonLabel: "Open",
          properties: ["openDirectory"],
          multiSelections: false
        })
        .then((result) => {
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
      state.serve = spawn(state.php, ["artisan", "serve"], { cwd: state.dir });
      state.serve.stdout.setEncoding("utf-8");
      state.serve.stdout.on("data", (data) => {
        if (data.includes("started")) {
          commit("updateServeLink", data.match(/(https?:\/\/[a-zA-Z0-9.]+(:[0-9]+)?)/g)[0]);
        }
      });
    },
    stopServe({ state }) {
      if (state.serve != null) {
        kill(state.serve.pid, "SIGKILL", function () {
          state.serve = null;
          state.serveLink = null;
        });
      }
    }
  }
});
