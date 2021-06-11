import { ipcMain, dialog, shell } from "electron";
import kill from "./tree-kill-sync.js";
import Store from "electron-store";
import which from "which";

const defaults = {
  recents: [],
  verbosity: 1,
  env: "",
  editor: "echo 'No command specified'",
  dark: false,
  php: ""
};
const store = new Store({ defaults });

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

  ipcMain.handle("choosePhpExecutable", async () => {
    const result = await dialog.showOpenDialog({ title: "Select php executable", properties: ["openFile"] });
    return result;
  });

  ipcMain.handle("getStore", (e, key) => {
    return store.get(key);
  });

  ipcMain.handle("setStore", (e, { key, value }) => {
    return store.set(key, value);
  });

  if (store.get("php") === "") {
    which("php")
      .then((resolvedPath) => {
        store.set("php", resolvedPath);
      })
      .catch(() => {
        dialog.showErrorBox("Error", "php executable not found.\r\nGo to Settings and choose an executable.");
      });
  }
}
