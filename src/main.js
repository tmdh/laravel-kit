const { app, BrowserWindow } = require("electron");
const { default: installExtension, VUEJS_DEVTOOLS } = require("electron-devtools-installer");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
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

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    installExtension(VUEJS_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log("An error occurred: ", err));
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
