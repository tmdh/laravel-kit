import { ipcRenderer } from "electron";
import kill from "tree-kill";
import Store from "electron-store";

const store = new Store();
window.store = store;

window.Electron = {
  dialogPhpNotFound,
  dialogError,
  kill
};

function dialogError(message) {
  ipcRenderer.send("dialogError", message);
}

function dialogPhpNotFound() {
  dialogError("phpNotFound");
}
