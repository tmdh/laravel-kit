import { exec } from "child_process";
import { ipcMain, dialog, shell } from "electron";
import killSync from "./tree-kill-sync.js";
import kill from "tree-kill";
import Store from "electron-store";
import which from "which";
import execa from "execa";
import { join } from "path";

const defaults = {
  recents: [],
  verbosity: 1,
  env: "",
  editor: "echo 'No command specified'",
  dark: true,
  php: ""
};
const store = new Store({ defaults });

export default async function () {
  ipcMain.on("stopServeSync", (e, pid) => {
    killSync(pid, "SIGKILL");
  });

  ipcMain.on("dialogError", (e, message) => {
    if (message === "phpNotFound") {
      message = "php executable not found.\r\nGo to Settings and choose an executable.";
    }
    dialog.showErrorBox("Error", message);
  });

  ipcMain.handle("dialogFolder", async () => {
    const result = await dialog.showOpenDialog({
      title: "Open project...",
      buttonLabel: "Open",
      properties: ["openDirectory"],
      multiSelections: false
    });
    return result;
  });

  ipcMain.handle("kill", async (e, pid) => {
    kill(pid, "SIGKILL");
  });

  ipcMain.on("showItemInFolder", (e, message) => {
    shell.showItemInFolder(message);
  });

  ipcMain.on("openInEditor", (e, dir) => {
    exec(store.get("editor"), { cwd: dir });
  });

  ipcMain.on("openExternal", (e, message) => {
    shell.openExternal(message);
  });

  ipcMain.handle("choosePhpExecutable", async () => {
    const result = await dialog.showOpenDialog({ title: "Select php executable", properties: ["openFile"] });
    return result;
  });

  ipcMain.handle("getPhpVersion", async () => {
    try {
      const { stdout } = await execa(store.get("php"), ["-v"]);
      return stdout;
    } catch (e) {
      return "PHP detection failed.";
    }
  });

  ipcMain.handle("getStore", (e, key) => {
    return store.get(key);
  });

  ipcMain.handle("setStore", (e, { key, value }) => {
    return store.set(key, value);
  });

  ipcMain.handle("tinker", async (e, { dir, code }) => {
    try {
      const { stdout } = await execa(store.get("php"), [join(__dirname, "tinker.php"), dir, code]);
      return stdout;
    } catch (e) {
      console.error(e);
      return e;
    }
  });

  if (store.get("php") === "") {
    try {
      const resolvedPath = await which("php");
      store.set("php", resolvedPath);
    } catch (e) {
      dialog.showErrorBox("Error", "php executable not found.\r\nGo to Settings and choose an executable.");
    }
  }
}
