/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {CustomFormConfig} from "../types.ts";
import {CustomFormsContext, type CustomFormsContextType} from "./CustomFormsContext.ts";
import type {ReactNode} from "react";

/**
 * Props for the custom forms provider component
 */
export interface CustomFormsProviderProps {
    /**
     * React children to be wrapped by the provider
     */
    children: ReactNode;

    /**
     * Optional array of custom form configurations
     */
    customForms?: CustomFormConfig[];
}

/**
 * Provider component that supplies custom form configurations to the React context tree.
 */
export const CustomFormsProvider = ({customForms, children}: CustomFormsProviderProps) => {
    const contextValue: CustomFormsContextType = {
        forms: customForms || [],
        hasForm: (key?: string) => {
            if (!key || !customForms || customForms.length === 0) {
                return false;
            }

            return customForms.some(c => c.formKey === key);
        },
        getForm: (key?: string) => {
            if (!key || !customForms || customForms.length === 0) {
                return undefined;
            }
            return customForms.find(c => c.formKey === key);
        },
    };
    return <CustomFormsContext.Provider value={contextValue}>
        {children}
    </CustomFormsContext.Provider>
};