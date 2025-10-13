/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {createContext} from "react";
import type {CustomFormConfig} from "../types.ts";

/**
 * Context interface providing access to custom form configurations
 */
export interface CustomFormsContextType {
    /**
     * Array of all available custom form configurations
     */
    forms: CustomFormConfig[];

    /**
     * Checks if a form exists for the given key
     * @param key - Optional form key to check for existence
     * @returns True if form with the specified key exists
     */
    hasForm: (key?: string) => boolean;

    /**
     * Retrieves form configuration by key
     * @param key - Optional form key to retrieve
     * @returns Custom form configuration or undefined if not found
     */
    getForm: (key?: string) => CustomFormConfig | undefined;
}

/**
 * React Context to hold configuration for the custom task and start forms.
 */
export const CustomFormsContext = createContext<CustomFormsContextType>({
    forms: [],
    hasForm: _key => {
        return false;
    },
    getForm: _key => {
        return undefined;
    }
});