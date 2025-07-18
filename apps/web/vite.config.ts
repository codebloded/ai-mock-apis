import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Pages from "vite-plugin-pages";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),

    Pages({
      importMode: "async",
      dirs: "src/pages",
    }),
  ],

  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
