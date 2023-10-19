import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "./src",
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "src/index.html"),
    },
    outDir: "../dist",
    chunkSizeWarningLimit: 1600,
  },
  resolve: {
    alias: {
      "/@/": path.resolve(__dirname, "src"),
    },
  },
  server: {
    open: true,
    host: "localhost",
  },
  assetsInclude: ["**/*.glb"],
});
