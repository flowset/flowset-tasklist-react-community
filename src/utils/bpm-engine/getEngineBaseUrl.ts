import type {BpmEngineConfig} from "@features/bpm-engine/types.ts";

/**
 * Retrieves the base URL for the BPM engine depending on the environment mode.
 *
 * @param {BpmEngineConfig} bpmEngine - The configuration object for the BPM engine containing the API URL.
 * @returns {string} The base URL for the BPM engine. In development mode, it returns the pathname of the API URL.
 *                   In other environments, it returns the full API URL.
 */
export const getEngineBaseUrl = (bpmEngine: BpmEngineConfig): string => {
    const engineUrlObj = new URL(bpmEngine.apiUrl);
    const isDevMode = import.meta.env.DEV;
    return  isDevMode ? engineUrlObj.pathname : bpmEngine.apiUrl;
};