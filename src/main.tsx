/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import "./index.css"
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ConfigProvider} from "antd";
import {openbpmTheme} from "./features/theme/openbpmTheme.ts";
import i18n from "./features/i18n/config";
import {I18nextProvider} from "react-i18next";
import {getEngineConfig} from "./features/bpm-engine/config.ts";
import "@ant-design/v5-patch-for-react-19";
import {TasklistAdmin} from "./features/TasklistAdmin.tsx";
import {customFormConfigs} from "./features/custom-forms/config.ts";
import {getAntDLocale} from "./features/i18n/getAntDLocale.ts";
import App from "./App.tsx";
import {type TasklistAuthConfig} from "./features/auth/types.ts";
import {getAuthConfigByType} from "./features/auth/config.ts";
import type {BpmEngineConfig} from "./features/bpm-engine/types.ts";
import {getEnv} from "./utils/env/env.ts";

const queryClient = new QueryClient();

const appLocale: string = i18n.language;
const engineConfig: BpmEngineConfig = getEngineConfig(getEnv("VITE_BPM_ENGINE_API_URL"), getEnv("VITE_BPM_ENGINE_TYPE"));
const authConfig: TasklistAuthConfig = getAuthConfigByType(getEnv("VITE_APP_AUTH_TYPE"));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider theme={openbpmTheme} locale={getAntDLocale(appLocale)}>
                    <I18nextProvider i18n={i18n} defaultNS="common">
                        <TasklistAdmin engine={engineConfig} customForms={customFormConfigs} authConfig={authConfig}>
                            <App/>
                        </TasklistAdmin>
                    </I18nextProvider>
                </ConfigProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)
