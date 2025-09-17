/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCallback, useEffect, useState} from "react";
import {type TasklistAuthProviderProps, TasklistAuthType, type User, type UserCredentials} from "../types.ts";
import {sessionUtils} from "../utils/sessionUtils.ts";
import type {User as OidcUser} from 'oidc-client-ts';
import {useAuth as useOIDCAuth} from 'react-oidc-context';
import {TasklistAuthContext} from "../TasklistAuthContext.ts";


/**
 * Wrapper component that provides OIDC authentication context for Tasklist.
 * Handles the complete OIDC authentication flow including automatic redirects,
 * user profile transformation, session persistence, and error handling.
 * Integrates with react-oidc-context to manage OIDC protocol interactions
 * and provides a unified auth interface for the application.
 */
export const OidcAuthProviderWrapper = ({children, config}: TasklistAuthProviderProps) => {
    const oidcAuth = useOIDCAuth();
    const [hasTriedSignin, setHasTriedSignin] = useState(false);

    const avatarClaim = config?.oidcConfig?.avatarClaim;

    /**
     * Transforms OIDC user profile into application user object
     */
    const transformOIDCUser = useCallback((oidcUser: OidcUser): User => ({
        id: oidcUser.profile.sub,
        username: oidcUser.profile.preferred_username!!,
        email: oidcUser.profile.email,
        firstName: oidcUser.profile.given_name,
        lastName: oidcUser.profile.family_name,
        avatar: avatarClaim ? oidcUser.profile[avatarClaim] as string : oidcUser.profile.picture
    }), [avatarClaim]);

    /**
     * Initiates OIDC authentication redirect flow
     */
    const login = async (_credentials?: UserCredentials): Promise<boolean> => {
        try {
            console.log('Starting OIDC redirect...');
            await oidcAuth.signinRedirect();
            setHasTriedSignin(true);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            setHasTriedSignin(false);
            return false;
        }
    };

    /**
     * Handles OIDC logout and session cleanup
     */
    const logout = async (): Promise<void> => {
        try {
            await oidcAuth.signoutRedirect();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            sessionUtils.clearSession();
            setHasTriedSignin(false);
        }
    };

    const user = oidcAuth.user ? transformOIDCUser(oidcAuth.user) : null;
    const token = oidcAuth.user?.access_token || null;

    useEffect(() => {
        if (
            !oidcAuth.isAuthenticated &&
            !oidcAuth.isLoading &&
            !hasTriedSignin
        ) {
            login();
        }
    }, [oidcAuth, oidcAuth?.isAuthenticated, oidcAuth?.isLoading, hasTriedSignin]);

    useEffect(() => {
        if (oidcAuth.user) {
            const transformedUser = transformOIDCUser(oidcAuth.user);
            sessionUtils.saveSession({
                user: transformedUser,
                token: oidcAuth.user.access_token,
                authType: TasklistAuthType.OIDC
            });
        }
    }, [oidcAuth.user, transformOIDCUser]);

    const value = {
        user,
        hasTriedSignin,
        token,
        login,
        logout,
        getAuthHeaders: () => ({
            'Authorization': token ? `Bearer ${token}` : ''
        }),
        isAuthenticated: !!oidcAuth.user && oidcAuth.isAuthenticated,
        isLoading: oidcAuth.isLoading,
        authType: config.type,
        loginError: oidcAuth.error
    };
    return (
        <TasklistAuthContext.Provider value={value}>
            {children}
        </TasklistAuthContext.Provider>
    );
};