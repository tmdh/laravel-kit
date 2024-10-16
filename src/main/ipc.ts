import { exec, spawn } from "child_process";
import { ipcMain, dialog, shell, BrowserWindow } from "electron";
import kill from "tree-kill";
import which from "which";
import { execa } from "execa";
import { join, basename } from "path";
import killSync from "./tree-kill-sync.js";
import { store } from "./store.js";
import { connectionFactory } from "./connection.js";

export default async function () {
  ipcMain.on("killSync", (e, pid) => {
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
      properties: ["openDirectory"]
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

  ipcMain.handle("artisan", async (e, { fullCommand, dir }) => {
    try {
      const { all } = await execa(store.get("php"), ["artisan", ...fullCommand, "--no-interaction", "--ansi"], { cwd: dir, all: true, buffer: true });
      return all;
    } catch (e: any) {
      console.log(`Error executing artisan command in ${dir}: ${fullCommand}`);
      console.error(e);
      return e.all; // e has all property when Options.all == true
    }
  });

  ipcMain.handle("openProject", async (e, factoryOptions) => {
    let connection = connectionFactory(factoryOptions);
    return await connection.openProject();
  });

  ipcMain.handle("startServe", (e, dir) => {
    const serve = spawn(store.get("php"), ["artisan", "serve"], { cwd: dir });
    serve.stdout.on("data", (data) => {
      if (data.includes("started")) {
        BrowserWindow.getAllWindows()[0].webContents.send("updateServeLink", data.toString().match(/(https?:\/\/[a-zA-Z0-9.]+(:[0-9]+)?)/g)[0]);
      }
    });
    return serve.pid;
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
