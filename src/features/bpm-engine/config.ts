/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {type BpmEngineConfig, EngineType} from "./types.ts";

export const DEFAULT_ENGINE_CONFIG: BpmEngineConfig = {
    apiUrl: "http://localhost:8080/engine-rest",
    type: EngineType.CAMUNDA_7
}

/**
 * Parses BPM engine configuration from environment variable string
 * @returns Parsed BPM engine configuration or undefined if parsing fails
 * @param engineUrl BPM engine
 * @param engineType
 */
export const createBpmEngineConfig = (engineUrl?: string, engineType?: string): BpmEngineConfig | undefined => {
    if (!engineUrl ) {
        console.warn('VITE_BPM_ENGINE_API_URL is not defined in environment variables');
        return undefined;
    }

    if(!engineType) {
        console.warn('VITE_BPM_ENGINE_TYPE is not defined in environment variables');
        return undefined;
    }

    return {
        apiUrl: engineUrl,
        type: engineType as EngineType
    }
}

/**
 * Retrieves BPM engine configuration, falling back to default if environment config is unavailable
 * @param engineUrl - Optional JSON string containing engine configuration from environment variables
 * @returns BPM engine configuration (either from environment or default)
 */
export const getEngineConfig = (engineUrl?: string, engineType?: string) => {
    return createBpmEngineConfig(engineUrl, engineType) || DEFAULT_ENGINE_CONFIG;
}