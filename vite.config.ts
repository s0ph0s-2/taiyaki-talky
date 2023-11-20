import { defineConfig } from "vite";
import { join } from "node:path";
import { buildSync } from "esbuild";

export default defineConfig({
  plugins: [
    {
      apply: "build",
      enforce: "post",
      transformIndexHtml() {
        buildSync({
          minify: true,
          bundle: true,
          entryPoints: [join(process.cwd(), "sw.js")],
          outfile: join(process.cwd(), "dist", "sw.js"),
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
