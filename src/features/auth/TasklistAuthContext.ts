/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {createContext} from "react";
import {type TasklistAuthType, type User, type UserCredentials} from "./types.ts";

/**
 * Context interface providing authentication state and methods for Tasklist.
 */
export interface TasklistAuthContextType {
    /**
     * Currently authenticated user or null if not logged in
     */
    user: User | null;
    /**
     * Function to authenticate a user with the provided credentials
     * @param credentials - user credentials for authentication, not required in case of OIDC authentication
     * @returns promise resolving to true if authentication was successful
     */
    login: (credentials?: UserCredentials) => Promise<boolean>;
    /**
     * Function to log out the current user
     */
    logout: () => void;
    /**
     * Function to get authentication headers for API requests
     * @returns authentication headers
     */
    getAuthHeaders: () => Record<string, string>;
    /**
     * Boolean indicating if a user is currently authenticated
     */
    isAuthenticated: boolean;
    /**
     * Boolean indicating if authentication is in progress
     */
    isLoading: boolean;
    /**
     * Boolean indicating if sign-in attempt has been made
     */
    hasTriedSignin: boolean;
    /**
     * Error object if authentication failed, null otherwise
     */
    loginError?: Error | null;
    /**
     * Type of authentication currently configured
     */
    authType: TasklistAuthType;
}

/**
 * React context for accessing Tasklist authentication state and methods.
 */
export const TasklistAuthContext = createContext<TasklistAuthContextType | null>(null);