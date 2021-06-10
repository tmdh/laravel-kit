import { ipcMain, dialog, shell } from "electron";
import kill from "./tree-kill-sync.js";

export default function () {
  ipcMain.on("stopServe", (e, pid) => {
    kill(pid, "SIGKILL");
  });

  ipcMain.on("dialogError", (e, message) => {
    if (message === "phpNotFound") {
      message = "php executable not found.\r\nGo to Settings and choose an executable.";
    }
    dialog.showErrorBox("Error", message);
  });

  ipcMain.on("showItemInFolder", (e, message) => {
    shell.showItemInFolder(message);
  });

  ipcMain.on("openExternal", (e, message) => {
    shell.openExternal(message);
  });
}
