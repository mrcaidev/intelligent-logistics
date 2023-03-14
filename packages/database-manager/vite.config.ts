import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "database-manager",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["fs/promises"],
    },
  },
});
