import { app, BrowserWindow, ipcMain } from "electron";
const { default: installExtension, VUEJS_DEVTOOLS } = require("electron-devtools-installer");
import kill from "./tree-kill-sync";
import windowStateKeeper from "electron-window-state";
import Store from "electron-store";

const defaults = {
  recents: [],
  verbosity: 1,
  editor: "echo 'No command specified'"
};
const store = new Store({ defaults });
store.clear();
console.log(store.get("recents"));
const isDev = process.env.NODE_ENV === "development";

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
      enableRemoteModule: true
    },
    show: false
  });

  winState.manage(win);

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
  win.on("ready-to-show", function() {
    win.show();
    win.focus();
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
