
/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Gets environment variable value from multiple sources with safe fallback.
 * Priority: window.env -> import.meta.env -> defaultValue
 *
 * @param key - environment variable name to lookup
 * @param defaultValue - fallback value if not found (default: "")
 * @returns environment variable value or defaultValue
 */
export const getEnv = (key: string, defaultValue: string = ""): string => {
    if (typeof window !== "undefined" && window.env && window.env[key] !== undefined) {
        return window.env[key]!;
    }

    if (import.meta.env[key]) {
        return import.meta.env[key] as string;
    }

    return defaultValue;
};