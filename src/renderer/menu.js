import { remote } from "electron";
const { Menu } = remote;
const isMac = process.platform === "darwin";
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: "Kit",
          submenu: [{ role: "about" }, { type: "separator" }, { role: "services" }, { type: "separator" }, { role: "hide" }, { role: "hideothers" }, { role: "unhide" }, { type: "separator" }, { role: "quit" }]
        }
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }]
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }]
            }
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "forceReload" }, { role: "toggleDevTools" }, { type: "separator" }, { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" }, { type: "separator" }, { role: "togglefullscreen" }]
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [{ role: "minimize" }, { role: "zoom" }, ...(isMac ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }] : [{ role: "close" }])]
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
  },
  {
    label: "SSSS",
    submenu: [
      {
        label: "ssss"
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);

export default menu;
