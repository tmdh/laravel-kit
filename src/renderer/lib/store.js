import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
var dark = false;
async () => {
  dark = await window.store.get("dark");
};

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
    dark: dark,
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
        dispatch("stopServe");
        state.project = null;
        state.name = null;
        state.dir = null;
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
    async startServe({ state }) {
      state.serve = await window.Electron.startServe(state.dir);
    },
    async stopServe({ state }) {
      if (state.serve != null) {
        await window.Electron.kill(state.serve);
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
