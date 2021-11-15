import { app, BrowserWindow, dialog } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import fixPath from "./fix-path.js";
import windowStateKeeper from "electron-window-state";
import { autoUpdater } from "electron-updater";
import Store from "electron-store";
import { format } from "url";
import { join, resolve } from "path";
import initIpcMain from "./ipc.js";
import initMenu from "./menu.js";

const isDev = process.env.NODE_ENV === "development";
const isWindows = process.platform === "win32";

fixPath();

function createWindow() {
  let winState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 720
  });
  let browserWindowOptions = {
    x: winState.x,
    y: winState.y,
    width: winState.width,
    height: winState.height,
    backgroundColor: new Store().get("dark") ? "#282A36" : "#FAFAFA",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: resolve(join(__dirname, "preload.js"))
    },
    show: false,
    title: "Kit"
  };
  if ((process.platform === "linux" && !isDev) || isDev) {
    browserWindowOptions.icon = resolve(process.cwd(), "build/icon.png");
  }
  const win = new BrowserWindow(browserWindowOptions);

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
  if (isWindows) {
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
  }
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
  } else if (isWindows) {
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
  console.log(__dirname);
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
