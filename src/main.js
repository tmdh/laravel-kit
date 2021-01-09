const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL(`http://localhost:4000`);
  } else {
    win.loadURL(
      require("url").format({
        pathname: require("path").join(__dirname, "../dist/app/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }
}

app.whenReady().then(createWindow);

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
