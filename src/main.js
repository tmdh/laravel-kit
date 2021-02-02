import { app, BrowserWindow, ipcMain } from "electron";
const { default: installExtension, VUEJS_DEVTOOLS } = require("electron-devtools-installer");
import kill from "./tree-kill-sync";

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: "#fff",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  if (isDev) {
    win.loadURL(`http://localhost:4000`);
    win.webContents.openDevTools();
  } else {
    win.loadURL(
      require("url").format({
        pathname: require("path").join(__dirname, "../dist/app/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }
  win.on("close", () => {
    win.webContents.send("app-close");
  });
}

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    if (isDev) {
      installExtension(VUEJS_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log("An error occurred: ", err));
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
