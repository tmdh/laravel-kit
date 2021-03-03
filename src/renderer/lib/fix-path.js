import { shellEnvSync } from "@/lib/shell-env";

export default function () {
  if (process.platform !== "darwin") {
    return;
  }
  process.env.PATH = shellEnvSync().PATH || ["./node_modules/.bin", "/.nodebrew/current/bin", "/usr/local/bin", process.env.PATH].join(":");
}
