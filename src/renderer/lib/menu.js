import { remote, shell } from "electron";
const { Menu } = remote;
import bus from "@/lib/bus.js";
import Store from "electron-store";
const isMac = process.platform === "darwin";

const template = [
  ...(isMac
    ? [
        {
          label: "Kit",
          submenu: [{ role: "services" }, { type: "separator" }, { role: "hide" }, { role: "hideothers" }, { role: "unhide" }, { type: "separator" }, { role: "quit" }]
        }
      ]
    : []),
  {
    label: "Project",
    submenu: [
      {
        label: "Open Project...",
        accelerator: "CmdOrCtrl+O",
        click() {
          bus.$emit("openDialog");
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
          bus.$emit("reloadProject");
        }
      },
      {
        label: "Close Project",
        click() {
          bus.$emit("closeProject");
        }
      },
      { type: "separator" },
      isMac ? { role: "close" } : { role: "quit" }
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
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  {
    label: "Window",
    submenu: [{ role: "minimize" }, ...(isMac ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }] : [{ role: "close" }])]
  },
  {
    role: "help",
    submenu: [
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
        label: "Wiki",
        click() {
          openLink("https://github.com/tmdh/laravel-kit/wiki");
        }
      },
      {
        label: "Releases",
        click() {
          openLink("https://github.com/tmdh/laravel-kit/releases");
        }
      },
      {
        label: "Report an issue",
        click() {
          openLink("https://github.com/tmdh/laravel-kit/issues/new");
        }
      },
      {
        label: "License",
        click() {
          openLink("https://github.com/tmdh/laravel-kit/blob/master/license.txt");
        }
      },
      {
        type: "separator"
      },
    ]
  }
];
const store = new Store();
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

getRecents();

bus.$on("getRecents", () => {
  getRecents();
});

function openLink(link) {
  shell.openExternal(link);
}

function getRecents() {
  let newTemplate = template;
  const recents = store.get("recents").map((dir) =>
    Object.assign({
      label: dir,
      click() {
        bus.$emit("openProject", dir);
      }
    })
  );
  const extraMenus = [
    { type: "separator" },
    {
      label: "Clear Recently Opened",
      click() {
        bus.$emit("clearRecents");
      }
    }
  ];
  newTemplate[isMac ? 1 : 0].submenu[1] = Object.assign({ label: "Open Recents", submenu: [...recents, ...extraMenus] });
  Menu.setApplicationMenu(Menu.buildFromTemplate(newTemplate));
}
