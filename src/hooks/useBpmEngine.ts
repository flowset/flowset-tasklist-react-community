/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useContext} from "react";
import { BpmEngineContext } from "@features/bpm-engine/context/BpmEngineContext";

/**
 * Custom hook to access the BPM engine context
 * Provides access to the BPM engine configuration and utilities
 *
 * @returns The BPM engine context value

 * @throws Error if used outside BpmEngineProvider
 */
export const useBpmEngine = () => {
    const context = useContext(BpmEngineContext);
    if (context === undefined) {
        throw new Error("useBpmEngine must be used within an BpmEngineProvider");
    }
    return context;
};