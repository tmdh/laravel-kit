import { createStore } from "vuex";

var dark = false;
async () => {
  dark = await window.store.get("dark");
};

interface Project {
  name: string;
  commands: [string];
}

interface State {
  tab: string;
  project: Project | null;
  name: string | null;
  dir: string | null;
  serve: number | null;
  serveLink: string | null;
  recents: [string] | [];
  verbosity: number;
  env: string;
  editor: string;
  opening: boolean;
  running: boolean;
  tinkering: boolean;
  dark: boolean;
  code: string;
  autoTinker: boolean;
  output: string;
  php: string;
}

export const store = createStore<State>({
  state: {
    tab: "Home",
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
    changeTab(state, tab) {
      state.tab = tab;
    },
    updateServeLink(state, link) {
      state.serveLink = link;
    },
    clearRecents(state) {
      window.store.set("recents", []);
      state.recents = [];
      window.kit.buildMenu(state.project !== null);
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
        const result = await window.kit.openProject({ type: "LocalFolder", dir: payload.dir });
        if (result.success) {
          context.state.dir = payload.dir;
          const parsedJson = JSON.parse(result.output);
          delete parsedJson.namespaces;
          context.state.project = JSON.parse(result.output);
          context.state.name = result.basename;
          document.title = `${context.state.name} - Kit`;
          context.dispatch("addRecent", payload.dir);
          window.kit.buildMenu(true);
        }
        context.state.opening = false;
      } else {
        window.kit.dialogPhpNotFound();
      }
    },
    async openDialog(context) {
      const result = await window.kit.dialogFolder();
      if (!result.canceled) {
        context.dispatch("openProject", { dir: result.filePaths[0] });
      }
    },
    closeProject({ state, dispatch }) {
      if (state.project !== null) {
        dispatch("stopServe");
        state.tab = "Home";
        state.project = null;
        state.name = null;
        state.dir = null;
      }
      window.kit.buildMenu(state.project !== null);
    },
    async executeTinker({ state }) {
      if (state.project !== null) {
        if (state.tab !== "Tinker") {
          state.tab = "Tinker";
        }
        if (state.php !== "" && state.dir != null) {
          state.tinkering = true;
          state.output = await window.kit.tinker(state.dir, state.code);
          state.tinkering = false;
        } else {
          window.kit.dialogPhpNotFound();
        }
      }
    },
    async startServe({ state }) {
      if (state.dir != null) {
        state.serve = await window.kit.startServe(state.dir);
      }
    },
    async stopServe({ state }) {
      if (state.serve != null) {
        await window.kit.kill(state.serve);
        state.serve = null;
        state.serveLink = null;
      }
    },
    async buildMenu(state) {
      const recents = await window.store.get("recents");
      state.commit("updateRecentsFromData", recents);
    },
    async addRecent(state, dir: string) {
      let newRecents = await window.store.get("recents");
      newRecents = newRecents.filter((item: string) => item != dir);
      newRecents.unshift(dir);
      window.store.set("recents", newRecents);
      state.dispatch("buildMenu");
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
