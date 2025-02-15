import { execa } from "execa";
import { BrowserWindow, dialog } from "electron";
import { basename, join } from "path";
import { store } from "./store.js";
import { ConnectionFactoryOptions, ConnectionOpenProjectResponse } from "../shared/types.js";
import { spawn } from "child_process";

interface Connection {
  openProject(): Promise<ConnectionOpenProjectResponse>;
  artisan(fullCommand: string): Promise<string>;
  startServe(): number | undefined;
  tinker(code: string): Promise<string>;
  //phpExecutableOfEnvironment(): string;
  //php: string;
  //addToRecent(): void;
}

function connectionFactory(factoryOptions: ConnectionFactoryOptions): Connection {
  if (factoryOptions.type == "LocalFolder") {
    return new LocalFolder(factoryOptions.dir);
  } else {
    return new LocalFolder(factoryOptions.dir);
  }
}

class LocalFolder implements Connection {
  dir: string;

  constructor(dir: string) {
    this.dir = dir;
  }

  async openProject(): Promise<ConnectionOpenProjectResponse> {
    try {
      const { all } = await execa(store.get("php"), ["artisan", "--format=json"], { cwd: this.dir, all: true, buffer: true });
      if (all?.includes("Laravel")) {
        return { success: true, output: all, basename: basename(this.dir) };
      } else {
        console.log(`Error opening project in ${this.dir}`);
        console.error(all);
        if (all?.includes("Could not open input file: artisan")) {
          dialog.showErrorBox("Error opening project", `${this.dir} - This folder is not a Laravel project. Please create a Laravel project and then open it.`);
        } else {
          dialog.showErrorBox("Error opening project", all ?? "unknown");
        }
        return { success: false };
      }
    } catch (e: any) {
      console.warn(`Error opening project in ${this.dir}`);
      console.log(e);
      if (e.all.includes("Could not open input file: artisan")) {
        dialog.showErrorBox("Error opening project", `${this.dir} - This folder is not a Laravel project. Please create a Laravel project and then open it.`);
      } else {
        dialog.showErrorBox("Error opening project", e.all);
      }
      return { success: false };
    }
  }

  async artisan(fullCommand: string): Promise<string> {
    try {
      const { all } = await execa(store.get("php"), ["artisan", ...fullCommand, "--no-interaction", "--ansi"], { cwd: this.dir, all: true, buffer: true });
      return all ?? "";
    } catch (e: any) {
      console.log(`Error executing artisan command in ${this.dir}: ${fullCommand}`);
      console.error(e);
      return e.all; // e has all property when Options.all == true
    }
  }

  startServe(): number | undefined {
    const serve = spawn(store.get("php"), ["artisan", "serve"], { cwd: this.dir });
    serve.stdout.on("data", (data) => {
      if (data.includes("started")) {
        BrowserWindow.getAllWindows()[0].webContents.send("updateServeLink", data.toString().match(/(https?:\/\/[a-zA-Z0-9.]+(:[0-9]+)?)/g)[0]);
      }
    });
    return serve.pid;
  }

  async tinker(code: string): Promise<string> {
    try {
      const { stdout } = await execa(store.get("php"), [join(__dirname, "tinker.php"), this.dir, code]);
      return stdout;
    } catch (e) {
      console.error(e);
      return e as string;
    }
  }
}

export { connectionFactory };
