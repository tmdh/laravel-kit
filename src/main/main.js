import { app, BrowserWindow, ipcMain, dialog } from "electron";
const { default: installExtension, VUEJS_DEVTOOLS } = require("electron-devtools-installer");
import kill from "./tree-kill-sync";
import windowStateKeeper from "electron-window-state";
import Store from "electron-store";
import { autoUpdater } from "electron-updater";
import { format } from "url";
import { join } from "path";

const isDev = process.env.NODE_ENV === "development";

const defaults = {
  recents: [],
  verbosity: 1,
  env: "",
  editor: "echo 'No command specified'",
  dark: false
};
new Store({ defaults }).clear();

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
      enableRemoteModule: true,
      contextIsolation: false
    },
    show: false
  });

  winState.manage(win);

  if (isDev) {
    win.loadURL(`http://localhost:4000`);
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

  autoUpdater.on("update-available", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Found Updates",
        message: "Found updates, do you want update now?",
        buttons: ["Sure", "No"]
      })
      .then((result) => {
        if (result.response == 0) {
          autoUpdater.downloadUpdate();
        }
      });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        title: "Install Updates",
        message: "Updates downloaded, application will be quit for update..."
      })
      .then(() => {
        setImmediate(() => autoUpdater.quitAndInstall());
      });
  });
}

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    if (isDev) {
      installExtension(VUEJS_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));
    } else {
      autoUpdater.checkForUpdates();
    }
  });

ipcMain.on("stopServe", (e, pid) => {
  kill(pid, "SIGKILL");
});

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
