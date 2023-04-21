import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    ...VitePluginNode({
      adapter: "express",
      appPath: "src/app.ts",
      exportName: "app",
    }),
  ],
  server: {
    port: 3000,
  },
});
