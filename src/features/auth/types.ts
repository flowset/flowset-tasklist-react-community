/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {BpmEngineConfig} from "../bpm-engine/types.ts";
import type {ReactNode} from "react";
import type {AuthProviderProps as ReactOidcAuthProviderProps} from "react-oidc-context";


/**
 * Enumeration of supported authentication types for OpenBPM Tasklist.
 */
export enum TasklistAuthType {
    /** Basic username/password authentication */
    BASIC = 'BASIC',
    /** OpenID Connect authentication */
    OIDC = 'OIDC',
}

/**
 * Authentication data stored for a user session.
 */
export interface StoredAuthData {
    token: string | null;
    user: User | null;
    authType: TasklistAuthType | null;
}

/**
 * Represents an authenticated user entity.
 */
export interface User {
    id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}

/**
 * Service interface for handling basic authentication with a BPM engine.
 */
export interface EngineBasicAuthService {
    /**
     * Authenticates a user with the provided credentials.
     * @param credentials - The user's login credentials
     * @param bpmEngineSettings - Optional BPM engine configuration
     * @returns promise resolving to true if authentication was successful
     */
    login: (credentials: UserCredentials, bpmEngineSettings?: BpmEngineConfig) => Promise<boolean>;

    /**
     * Terminates the current user session.
     * @returns promise that resolves when logout is complete
     */
    logout: () => Promise<void>;

    /**
     * Retrieves the currently authenticated user.
     * @returns The authenticated user object or null if not logged in
     */
    getUser: () => User | null;

    /**
     * Retrieves the current authentication token.
     * @returns The authentication token string or null if not available
     */
    getToken: () => string | null;

    /**
     * Creates HTTP headers for authenticated requests.
     * @returns authentication headers
     */
    getAuthHeaders: () => Record<string, string>;

    /**
     * Checks if a user is currently authenticated.
     * @returns true if a user is authenticated, false otherwise
     */
    isAuthenticated: () => boolean;
}

/**
 * User credentials to log in
 */
export interface UserCredentials {
    username: string;
    password: string;
}

/**
 * Props for the Tasklist authentication provider component.
 */
export interface TasklistAuthProviderProps {
    children: ReactNode;
    config: TasklistAuthConfig;
}

/**
 * Configuration object for Tasklist authentication.
 */
export interface TasklistAuthConfig {
    type: TasklistAuthType;
    oidcConfig?: TasklistOidcProviderProps;
}

/**
 * Extended OIDC provider properties with custom claims support.
 */
export interface OidcAuthProviderProps {
    avatarClaim?: string;
}

export type TasklistOidcProviderProps = ReactOidcAuthProviderProps & OidcAuthProviderProps;

