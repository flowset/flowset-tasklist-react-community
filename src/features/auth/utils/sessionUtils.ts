/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {type StoredAuthData, TasklistAuthType} from "../types";

const AUTH_TOKEN_KEY = "OPENBPM_TASKLIST_AUTH_TOKEN";
const AUTH_USER_KEY = "OPENBPM_TASKLIST_AUTH_USER";
const AUTH_TYPE_KEY = "OPENBPM_TASKLIST_AUTH_TYPE";

/**
 * Utility functions for managing authentication session storage
 */
export const sessionUtils = {

    /**
     * Saves authentication data to session storage
     * @param data - authentication data containing token, user and auth type
     */
    saveSession: (data: StoredAuthData): void => {
        if (data.token && data.user && data.authType) {
            sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
            sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
            sessionStorage.setItem(AUTH_TYPE_KEY, data.authType);
        }
    },

    /**
     * Clears all authentication data from session storage
     */
    clearSession: (): void => {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_USER_KEY);
        sessionStorage.removeItem(AUTH_TYPE_KEY);
    },

    /**
     * Retrieves the authentication token from session storage
     * @returns authentication token string or null if not found
     */
    getToken: (): string | null => {
        return sessionStorage.getItem(AUTH_TOKEN_KEY) || null;
    },

    /**
     * Retrieves complete authentication session data
     * @returns object containing token, user data and authentication type
     */
    getSession: (): StoredAuthData => {
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
        const user = sessionStorage.getItem(AUTH_USER_KEY);
        const type = sessionStorage.getItem(AUTH_TYPE_KEY);

        return {
            token,
            user: user ? JSON.parse(user) : null,
            authType: type as TasklistAuthType
        };
    },

    /**
     * Validates if the current session is valid for the expected authentication type
     * @param expectedType - the expected authentication type to validate against
     * @returns true if session contains valid token, user and matching auth type
     */
    isValidSession: (expectedType: string): boolean => {
        const session = sessionUtils.getSession();
        return !!session.token && !!session.user && session.authType === expectedType;
    }
};