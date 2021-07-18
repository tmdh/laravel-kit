const { buildSync } = require("esbuild");
const options = {
  platform: "node",
  bundle: true,
  external: ["electron"],
  define: {
    "process.env.NODE_ENV": `"${process.argv[2] === "--dev" ? "development" : "production"}"`
  }
};
buildSync({
  entryPoints: ["src/main/main.js"],
  outfile: "dist/main.js",
  ...options
});
console.log("built src/main/main.js -> dist/main.js");
buildSync({
  entryPoints: ["src/preload/preload.js"],
  outfile: "dist/preload.js",
  ...options
});
console.log("built src/preload/preload.js -> dist/preload.js");
