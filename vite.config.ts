/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {defineConfig, loadEnv} from "vite"
import react from "@vitejs/plugin-react"
import {getEngineConfig} from "./src/features/bpm-engine/config.ts";
import type {BpmEngineConfig} from "./src/features/bpm-engine/types.ts";
import path from "path";


// https://vite.dev/config/
export default ({mode}: { mode: string }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    const engineUrl = process.env.VITE_BPM_ENGINE_API_URL;
    const engineType = process.env.VITE_BPM_ENGINE_TYPE;

    const engineConfig: BpmEngineConfig = getEngineConfig(engineUrl, engineType);
    const engineApiUrl = new URL(engineConfig.apiUrl);

    return defineConfig({
        plugins: [react()],
        server: {
            proxy: {
                [`${engineApiUrl.pathname}`]: {
                    target: `${engineApiUrl.origin}`,
                    changeOrigin: true,
                    configure: (proxy, _options) => {
                        proxy.on("proxyRes", (proxyRes, _req, _res) => {
                            if (proxyRes.statusCode === 401) {
                                // to hide standard basic auth dialog in browser
                                delete proxyRes.headers["www-authenticate"];
                            }
                        });
                    }
                },

            }
        },
        resolve: {
            alias: {
                "@assets": path.resolve(__dirname, "./src/assets"),
                "@components": path.resolve(__dirname, "./src/components"),
                "@features": path.resolve(__dirname, "./src/features"),
                "@hooks": path.resolve(__dirname, "./src/hooks"),
                "@models": path.resolve(__dirname, "./src/models"),
                "@pages": path.resolve(__dirname, "./src/pages"),
                "@routes": path.resolve(__dirname, "./src/routes"),
                "@utils": path.resolve(__dirname, "./src/utils"),
            },
        },
    });
}
