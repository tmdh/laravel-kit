import { ipcRenderer } from "electron";
import { App } from "vue";
import { ConnectionFactoryOptions, ConnectionOpenProjectResponse } from "../shared/types";

declare global {
  interface Window {
    kit: ElectronInterface;
    store: StoreInterface;
    app: App<Element>;
  }

  interface ElectronInterface {
    dialogPhpNotFound(): void;
    dialogError(message: string): void;
    dialogFolder(): Promise<any>;
    kill(pid: number): void;
    showItemInFolder(fullPath: string): void;
    openInEditor(dir: string): void;
    openExternal(fullPath: string): void;
    choosePhpExecutable(): Promise<void>;
    getPhpVersion(): Promise<string>;
    buildMenu(isProject: boolean): void;
    tinker(dir: string, code: string): Promise<string>;
    artisan(fullCommand: string, dir: string): Promise<string>;
    openProject(dir: ConnectionFactoryOptions): Promise<ConnectionOpenProjectResponse>;
    startServe(dir: string): Promise<number>;
    killSync(serve: number): void;
  }

  interface StoreInterface {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
  }
}

window.kit = {
  dialogPhpNotFound,
  dialogError,
  dialogFolder,
  kill,
  showItemInFolder,
  openInEditor,
  openExternal,
  choosePhpExecutable,
  getPhpVersion,
  buildMenu,
  tinker,
  artisan,
  openProject,
  startServe,
  killSync
};

window.store = {
  get: getStore,
  set: setStore
};

ipcRenderer.on("openDialog", () => {
  window.app._context.provides.store.dispatch("openDialog");
});
ipcRenderer.on("reloadProject", () => {
  window.app._context.provides.store.dispatch("openProject", { dir: window.app._context.provides.store.state.dir, reload: true });
});
ipcRenderer.on("closeProject", () => {
  window.app._context.provides.store.dispatch("closeProject");
});
ipcRenderer.on("clearRecents", () => {
  window.app._context.provides.store.commit("clearRecents");
});
ipcRenderer.on("openProject", (e, dir) => {
  window.app._context.provides.store.dispatch("openProject", { dir, reload: true });
});
ipcRenderer.on("executeTinker", () => {
  window.app._context.provides.store.dispatch("executeTinker");
});
ipcRenderer.on("updateServeLink", (e, link) => {
  window.app._context.provides.store.commit("updateServeLink", link);
});

function dialogError(message: string) {
  ipcRenderer.send("dialogError", message);
}

function dialogPhpNotFound() {
  dialogError("phpNotFound");
}

async function dialogFolder() {
  return await ipcRenderer.invoke("dialogFolder");
}

async function kill(pid: number) {
  await ipcRenderer.invoke("kill", pid);
}

function showItemInFolder(fullPath: string) {
  ipcRenderer.send("showItemInFolder", fullPath);
}

function openInEditor(dir: string) {
  ipcRenderer.send("openInEditor", dir);
}

function openExternal(fullPath: string) {
  ipcRenderer.send("openExternal", fullPath);
}

async function choosePhpExecutable() {
  const result = await ipcRenderer.invoke("choosePhpExecutable");
  return result;
}

async function getPhpVersion() {
  const result = await ipcRenderer.invoke("getPhpVersion");
  return result;
}

async function getStore(key: string) {
  const value = await ipcRenderer.invoke("getStore", key);
  return value;
}

async function setStore(key: string, value: any) {
  await ipcRenderer.invoke("setStore", { key, value });
}

function buildMenu(isProject: boolean) {
  ipcRenderer.send("buildMenu", isProject);
}

async function tinker(dir: string, code: string) {
  const output = await ipcRenderer.invoke("tinker", { dir, code });
  return output;
}

async function artisan(fullCommand: string, dir: string) {
  const output = await ipcRenderer.invoke("artisan", { fullCommand, dir });
  return output;
}

async function openProject(dir: ConnectionFactoryOptions) {
  const output = await ipcRenderer.invoke("openProject", dir);
  return output;
}

async function startServe(dir: string) {
  const serve = await ipcRenderer.invoke("startServe", dir);
  return serve;
}

function killSync(serve: number) {
  ipcRenderer.send("killSync", serve);
}
