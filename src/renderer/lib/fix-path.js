import { shellEnv } from "@/lib/shell-env";

export default function () {
  if (process.platform !== "darwin") {
    return;
  }
  process.env.PATH = shellEnv().PATH || ["./node_modules/.bin", "/.nodebrew/current/bin", "/usr/local/bin", process.env.PATH].join(":");
}
