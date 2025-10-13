/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useContext} from "react";
import { CustomFormsContext } from "@features/custom-forms/context/CustomFormsContext";

/**
 * Custom hook to access the custom forms context
 * Provides access to custom form configurations and utilities
 *
 * @returns The custom forms context value
 * @throws Error if used outside CustomFormsProvider
 */
export const useCustomForms = () => {
    const context = useContext(CustomFormsContext);
    if (context === undefined) {
        throw new Error("useCustomForms must be used within an CustomFormsProvider");
    }
    return context;
};