const { buildSync } = require("esbuild");
const { copyFileSync } = require("fs");
const options = {
  platform: "node",
  bundle: true,
  external: ["electron"],
  define: {
    "process.env.NODE_ENV": `"${process.argv[2] === "--dev" ? "development" : "production"}"`,
    "process.platform": `"${process.platform}"`
  }
};
buildSync({
  entryPoints: ["src/main/main.ts"],
  outfile: "dist/main.js",
  ...options,
  minify: process.argv[2] === "--dev" ? false : true
});
console.log("built src/main/main.js -> dist/main.js");
buildSync({
  entryPoints: ["src/preload/preload.js"],
  outfile: "dist/preload.js",
  ...options
});
console.log("built src/preload/preload.js -> dist/preload.js");
copyFileSync("src/main/tinker.php", "dist/tinker.php");
console.log("copied src/main/tinker.php -> dist/tinker.php");
copyFileSync("build/icon.png", "dist/icon.png");
console.log("copied build/icon.png -> dist/icon.png");
