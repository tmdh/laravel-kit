import Vue from "vue";
import Vuex from "vuex";
import { exec, spawn } from "child_process";
import basename from "basename";
// import bus from "@/lib/bus.js";

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
    dark: window.dark,
    code: `// Write your tinker code here\nuse Illuminate\\Foundation\\Inspiring;\nInspiring::quote();`,
    autoTinker: false,
    output: "// The output is shown here",
    php: ""
  },
  mutations: {
    updateServeLink(state, link) {
      state.serveLink = link;
    },
    stopServeSync(state) {
      if (state.serve != null) {
        window.Electron.kill(state.serve.pid, "SIGKILL", function () {
          state.serve = null;
          state.serveLink = null;
        });
      }
    },
    clearRecents(state) {
      window.store.set("recents", []);
      state.recents = [];
      window.Electron.getRecents();
    },
    updateSettingsStateFromData(state, data) {
      state.verbosity = data.verbosity;
      state.env = data.env;
      state.editor = data.editor;
      state.dark = data.dark;
      state.php = data.php;
    },
    updateRecentsFromData(state, data) {
      state.recents = data;
    }
  },
  actions: {
    openProject(context, payload) {
      if (payload.dir === null) {
        return;
      }
      if (context.state.php !== "") {
        if (payload.reload === undefined) {
          context.dispatch("closeProject");
        }
        context.state.opening = true;
        exec(`"${context.state.php}" artisan --format=json`, { cwd: payload.dir }, (error, stdout) => {
          if (error) {
            let message = stdout.length > 0 ? stdout : `${error}`;
            if (stdout.includes("Could not open input file: artisan")) {
              message = `${payload.dir} - This folder is not a Laravel project. Please create a Laravel project and then open it.`;
            }
            window.Electron.dialogError(message);
            context.state.opening = false;
          } else {
            if (stdout.includes("Laravel")) {
              context.state.dir = payload.dir;
              context.state.project = JSON.parse(stdout);
              context.state.project.namespaces = null;
              context.state.name = basename(payload.dir);
              document.title = `${context.state.name} - Kit`;
              context.dispatch("addRecent", payload.dir);
            }
            context.state.opening = false;
          }
        });
      } else {
        window.Electron.dialogPhpNotFound();
      }
    },
    async openDialog(context) {
      const result = await window.Electron.dialogFolder();
      if (!result.canceled) {
        context.dispatch("openProject", { dir: result.filePaths[0] });
      }
    },
    closeProject({ state, dispatch }) {
      if (state.project !== null) {
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
        window.Electron.kill(state.serve.pid, "SIGKILL", function () {
          state.serve = null;
          state.serveLink = null;
        });
      }
    },
    async getRecents(state) {
      const recents = await window.store.get("recents");
      state.commit("updateRecentsFromData", recents);
    },
    async addRecent(state, dir) {
      let newRecents = await window.store.get("recents");
      newRecents = newRecents.filter((item) => item != dir);
      newRecents.unshift(dir);
      window.store.set("recents", newRecents);
      state.dispatch("getRecents");
      window.Electron.getRecents();
    },
    async updateSettingsState(state) {
      const verbosity = await window.store.get("verbosity");
      const env = await window.store.get("env");
      const editor = await window.store.get("editor");
      const dark = await window.store.get("dark");
      const php = await window.store.get("php");
      state.commit("updateSettingsStateFromData", { verbosity, env, editor, dark, php });
    }
  }
});
