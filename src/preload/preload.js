import { ipcRenderer } from "electron";

window.Electron = {
  dialogPhpNotFound,
  dialogError,
  dialogFolder,
  kill,
  showItemInFolder,
  openInEditor,
  openExternal,
  choosePhpExecutable,
  getPhpVersion,
  getRecents,
  tinker,
  artisan,
  openProject,
  startServe
};

window.store = {
  get: getStore,
  set: setStore
};

ipcRenderer.on("app-close", () => {
  if (window.app.$store.state.serve != null) {
    ipcRenderer.send("stopServeSync", window.app.$store.state.serve);
  }
});

ipcRenderer.on("openDialog", () => {
  window.app.$store.dispatch("openDialog");
});
ipcRenderer.on("reloadProject", () => {
  window.app.$store.dispatch("openProject", { dir: window.app.$store.state.dir, reload: true });
});
ipcRenderer.on("closeProject", () => {
  window.app.$store.dispatch("closeProject");
});
ipcRenderer.on("clearRecents", () => {
  window.app.$store.commit("clearRecents");
});
ipcRenderer.on("openProject", (e, dir) => {
  window.app.$store.dispatch("openProject", { dir, reload: true });
});
ipcRenderer.on("executeTinker", () => {
  window.app.$store.dispatch("executeTinker");
});
ipcRenderer.on("updateServeLink", (e, link) => {
  window.app.$store.commit("updateServeLink", link);
});

function dialogError(message) {
  ipcRenderer.send("dialogError", message);
}

function dialogPhpNotFound() {
  dialogError("phpNotFound");
}

async function dialogFolder() {
  return await ipcRenderer.invoke("dialogFolder");
}

async function kill(pid) {
  await ipcRenderer.invoke("kill", pid);
}

function showItemInFolder(fullPath) {
  ipcRenderer.send("showItemInFolder", fullPath);
}

function openInEditor(dir) {
  ipcRenderer.send("openInEditor", dir);
}

function openExternal(fullPath) {
  ipcRenderer.send("openExternal", fullPath);
}

async function choosePhpExecutable() {
  const result = await ipcRenderer.invoke("choosePhpExecutable");
  return result;
}

async function getPhpVersion() {
  const result = await ipcRenderer.invoke("getPhpVersion");
  return result;
}

async function getStore(key) {
  const value = await ipcRenderer.invoke("getStore", key);
  return value;
}

function setStore(key, value) {
  ipcRenderer.invoke("setStore", { key, value });
}

function getRecents() {
  ipcRenderer.send("getRecents");
}

async function tinker(dir, code) {
  const output = await ipcRenderer.invoke("tinker", { dir, code });
  return output;
}

async function artisan(fullCommand, dir) {
  const output = await ipcRenderer.invoke("artisan", { fullCommand, dir });
  return output;
}

async function openProject(dir) {
  const output = await ipcRenderer.invoke("openProject", dir);
  return output;
}

async function startServe(dir) {
  const serve = await ipcRenderer.invoke("startServe", dir);
  return serve;
}
