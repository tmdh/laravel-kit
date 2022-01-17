import Vue from "vue";
import Vuex from "vuex";
import { spawn } from "child_process";

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
    async openProject(context, payload) {
      if (payload.dir === null) {
        return;
      }
      if (context.state.php !== "") {
        if (payload.reload === undefined) {
          context.dispatch("closeProject");
        }
        context.state.opening = true;
        const { success, output, basename } = await window.Electron.openProject(payload.dir);
        if (success) {
          context.state.dir = payload.dir;
          context.state.project = JSON.parse(output);
          context.state.project.namespaces = null;
          context.state.name = basename;
          document.title = `${context.state.name} - Kit`;
          context.dispatch("addRecent", payload.dir);
        }
        context.state.opening = false;
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
    async executeTinker({ state }) {
      if (state.project !== null) {
        if (state.php !== "") {
          state.tinkering = true;
          state.output = await window.Electron.tinker(state.dir, state.code);
          state.tinkering = false;
        } else {
          window.Electron.dialogPhpNotFound();
        }
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
    async stopServe({ state }) {
      if (state.serve != null) {
        await window.Electron.kill(state.serve.pid);
        state.serve = null;
        state.serveLink = null;
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
