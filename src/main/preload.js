import { ipcRenderer } from "electron";

window.Electron = {
  dialogPhpNotFound,
  dialogError
};

function dialogError(message) {
  ipcRenderer.send("dialogError", message);
}

function dialogPhpNotFound() {
  dialogError("phpNotFound");
}
