import { remote } from "electron";
const { Menu } = remote;
const isMac = process.platform === "darwin";
import bus from "@/lib/bus";

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
    submenu: [{ role: "reload" }, { role: "forceReload" }, { role: "toggleDevTools" }, { type: "separator" }, { role: "togglefullscreen" }]
  },
  {
    label: "Window",
    submenu: [{ role: "minimize" }, ...(isMac ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }] : [{ role: "close" }])]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
export default menu;
