/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {createContext} from "react";
import type {BpmEngineConfig} from "../types.ts";

/**
 * Context interface providing BPM engine configuration and runtime information
 */
export interface BpmEngineContextType {
    /**
     * The configuration of currently selected BPM engine
     */
    selectedEngine: BpmEngineConfig;

    /**
     * Base URL for web applications associated with the BPM engine
     */
    webAppsUrl?: string;
}

/**
 * React Context to hold data related to the BPM engine and its configuration.
 */
export const BpmEngineContext = createContext<BpmEngineContextType | null>(null);