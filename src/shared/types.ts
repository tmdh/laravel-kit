import { App } from "vue";

type ConnectionOpenProjectResponse =
  | {
      success: true;
      output: string;
      basename: string;
    }
  | { success: false };

type ConnectionFactoryOptions = {
  type: "LocalFolder";
  dir: string;
};

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

export { ConnectionOpenProjectResponse, ConnectionFactoryOptions };
