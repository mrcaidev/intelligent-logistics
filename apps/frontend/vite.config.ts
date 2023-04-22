import react from "@vitejs/plugin-react-swc";
import { presetUno } from "unocss";
import { presetScrollbar } from "unocss-preset-scrollbar";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    unocss({
      presets: [presetUno(), presetScrollbar()],
    }),
  ],
});
