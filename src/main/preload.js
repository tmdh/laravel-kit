import { ipcRenderer } from "electron";

window.Electron = {
  dialogPhpNotFound
};

function dialogPhpNotFound() {
  ipcRenderer.send("dialog", "phpNotFound");
}
