import { ipcRenderer } from "electron";
import kill from "tree-kill";
import Store from "electron-store";

// Electron Store
const store = new Store();
window.store = store;

window.Electron = {
  dialogPhpNotFound,
  dialogError,
  kill,
  showItemInFolder,
  openExternal
};

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
