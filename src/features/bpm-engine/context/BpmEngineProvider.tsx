/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ReactNode} from "react";
import {type BpmEngineConfig, EngineType} from "../types.ts";
import type {BpmEngineContextType} from "./BpmEngineContext.ts";
import {BpmEngineContext} from "./BpmEngineContext.ts";

const WEB_APPS_PATH = {
    [EngineType.CAMUNDA_7]: "/camunda/app/tasklist",
    [EngineType.OPERATON]: "/operaton/app/tasklist",
};

/**
 * Props for the BPM engine provider component
 */
export interface BpmEngineProviderProps {
    /**
     * Optional BPM engine configuration
     */
    engine?: BpmEngineConfig;
    /**
     * React children to be wrapped by the provider
     */
    children: ReactNode;
}

/**
 * Provider component that supplies BPM engine configuration and derived web application URLs
 * to the React context tree. Automatically generates web app URLs based on engine type.
 */
export const BpmEngineProvider = ({engine, children}: BpmEngineProviderProps) => {
    let contextValue: BpmEngineContextType | null = null;
    if (engine) {
        const type = engine.type;

        const engineUrlObj = new URL(engine.apiUrl);
        const webAppsPath = WEB_APPS_PATH[type];
        const webAppsUrl = webAppsPath ? `${engineUrlObj.origin}${webAppsPath}}` : undefined;

        contextValue = {
            selectedEngine: engine,
            webAppsUrl
        };
    }

    return (
        <BpmEngineContext.Provider value={contextValue}>
            {children}
        </BpmEngineContext.Provider>
    );
};