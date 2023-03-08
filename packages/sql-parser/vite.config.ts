import { defineConfig } from "vite";
// import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    // dts()
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "sql-parser",
      fileName: "index",
      formats: ["es"],
    },
  },
});
