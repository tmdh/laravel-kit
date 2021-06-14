import { app, BrowserWindow, dialog } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import fixPath from "./fix-path.js";
import windowStateKeeper from "electron-window-state";
import { autoUpdater } from "electron-updater";
import { format } from "url";
import { join, resolve } from "path";
import initIpcMain from "./ipc.js";
import initMenu from "./menu.js";

const isDev = process.env.NODE_ENV === "development";

fixPath();

function createWindow() {
  let winState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 720
  });
  const win = new BrowserWindow({
    x: winState.x,
    y: winState.y,
    width: winState.width,
    height: winState.height,
    backgroundColor: "#FAFAFA",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: resolve(join(__dirname, "preload.js"))
    },
    show: false,
    title: "Kit"
  });

  winState.manage(win);

  if (isDev) {
    win.loadURL(`http://localhost:4999`);
  } else {
    win.loadURL(
      format({
        pathname: join(__dirname, "app", "index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }
  win.on("close", () => {
    win.webContents.send("app-close");
  });
  win.once("ready-to-show", () => {
    win.show();
    win.focus();
    if (isDev) {
      win.webContents.openDevTools();
    }
  });

  autoUpdater.autoDownload = false;
  autoUpdater.on("error", (_, error) => {
    if (!error.toString().includes("ERR_NAME_NOT_RESOLVED")) {
      dialog.showErrorBox("Error", error == null ? "unknown" : error.toString());
    }
  });

  autoUpdater.on("update-available", async () => {
    const result = await dialog.showMessageBox({
      type: "info",
      title: "Found Updates",
      message: "Found updates, do you want update now?",
      buttons: ["Sure", "No"]
    });
    if (result.response == 0) {
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on("update-downloaded", async () => {
    await dialog.showMessageBox({
      title: "Install Updates",
      message: "Updates downloaded, application will be quit for update..."
    });
    setImmediate(() => autoUpdater.quitAndInstall());
  });
  initMenu(win);
}

(async () => {
  await app.whenReady();
  createWindow();
  if (isDev) {
    try {
      const name = await installExtension(VUEJS_DEVTOOLS);
      console.log(`Added Extension:  ${name}`);
    } catch (e) {
      console.log("An error occurred: ", e);
    }
  } else {
    try {
      await autoUpdater.checkForUpdates();
    } catch (e) {
      if (e.toString().includes("ERR_NAME_NOT_RESOLVED")) {
        console.log("Auto update failed, reason: network offline.");
      } else {
        console.log(e);
      }
    }
  }
})();

initIpcMain();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
