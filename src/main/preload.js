import { ipcRenderer } from "electron";
import kill from "tree-kill";

// Electron Store
window.store = {
  get: getStore,
  set: setStore
};

window.Electron = {
  dialogPhpNotFound,
  dialogError,
  kill,
  showItemInFolder,
  openExternal,
  choosePhpExecutable
};

window.dark = true;
(async () => {
  window.dark = await getStore("dark");
})();

function dialogError(message) {
  ipcRenderer.send("dialogError", message);
}

function dialogPhpNotFound() {
  dialogError("phpNotFound");
}

function showItemInFolder(fullPath) {
  ipcRenderer.send("showItemInFolder", fullPath);
}

function openExternal(fullPath) {
  ipcRenderer.send("openExternal", fullPath);
}

async function choosePhpExecutable() {
  const result = await ipcRenderer.invoke("choosePhpExecutable");
  return result;
}

async function getStore(key) {
  const value = await ipcRenderer.invoke("getStore", key);
  return value;
}

function setStore(key, value) {
  ipcRenderer.invoke("setStore", { key, value });
}
