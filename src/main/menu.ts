import { BrowserWindow, ipcMain, Menu, shell, app, MenuItemConstructorOptions } from "electron";
import Store from "electron-store";
import { KitStore } from "./store.js";
const store = new Store<KitStore>();

function template(win: BrowserWindow): MenuItemConstructorOptions[] {
  const isMac = process.platform === "darwin";
  return [
    ...((isMac
      ? [
          {
            label: "Kit",
            submenu: [{ role: "services" }, { type: "separator" }, { role: "hide" }, { role: "hideothers" }, { role: "unhide" }, { type: "separator" }, { role: "quit" }]
          }
        ]
      : []) as MenuItemConstructorOptions[]),
    {
      label: "Project",
      submenu: [
        {
          label: "Open Project...",
          accelerator: "CmdOrCtrl+O",
          click() {
            win.webContents.send("openDialog");
          }
        },
        {
          label: "Open Recent",
          submenu: [
            {
              label: "test here"
            }
          ]
        },
        {
          label: "Reload Project",
          click() {
            win.webContents.send("reloadProject");
          }
        },
        {
          label: "Close Project",
          click() {
            win.webContents.send("closeProject");
          }
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" }
      ]
    },
    {
      label: "Laravel",
      submenu: [
        {
          label: "Tinker Now",
          accelerator: "CmdOrCtrl+T",
          click() {
            win.webContents.send("executeTinker");
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [{ role: "undo" }, { role: "redo" }, { type: "separator" }, { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" }]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, ...((isMac ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }] : [{ role: "close" }]) as MenuItemConstructorOptions[])]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Wiki",
          click() {
            openLink("https://github.com/tmdh/laravel-kit/wiki");
          }
        },
        {
          label: "Report an issue",
          click() {
            openLink("https://github.com/tmdh/laravel-kit/issues/new");
          }
        },
        {
          label: "Releases",
          click() {
            openLink("https://github.com/tmdh/laravel-kit/releases");
          }
        },
        {
          label: "License",
          click() {
            openLink("https://github.com/tmdh/laravel-kit/blob/master/license.txt");
          }
        },
        {
          label: "Laravel Kit on GitHub",
          click() {
            openLink("https://github.com/tmdh/laravel-kit");
          }
        },
        {
          label: "Laravel Kit Website",
          click() {
            openLink("https://tmdh.github.io/laravel-kit");
          }
        },
        {
          label: `App version: ${app.getVersion()}`,
          enabled: false
        }
      ]
    }
  ];
}

ipcMain.on("getRecents", async () => {
  await getRecents(BrowserWindow.getAllWindows()[0]);
});

function openLink(link: string) {
  shell.openExternal(link);
}

async function getRecents(win: BrowserWindow) {
  let newTemplate = template(win);
  const isMac = process.platform === "darwin";
  const recents = store.get("recents").map((dir) =>
    Object.assign({
      label: dir,
      click() {
        win.webContents.send("openProject", dir);
      }
    })
  );
  const extraMenus = [
    { type: "separator" },
    {
      label: "Clear Recently Opened",
      click() {
        win.webContents.send("clearRecents");
      }
    }
  ];
  // FIXME: TypeSript Error
  newTemplate[isMac ? 1 : 0].submenu[1] = Object.assign({ label: "Open Recents", submenu: [...recents, ...extraMenus] });
  Menu.setApplicationMenu(Menu.buildFromTemplate(newTemplate));
}

export default async function (win: BrowserWindow): Promise<void> {
  const menu = Menu.buildFromTemplate(template(win));
  Menu.setApplicationMenu(menu);
  await getRecents(win);
}
