import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            name: "markdown-loader",
            transform(code, id) {
                if (id.endsWith(".md")) {
                    return `export default ${JSON.stringify(code)};`;
                }
            },
        },
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: "gzip",
            ext: ".gz",
        }),
        viteTsconfigPaths(),
        svgr({
            include: "**/*.svg?react",
        }),
    ],
    build: {
        outDir: "build",
    },
});
