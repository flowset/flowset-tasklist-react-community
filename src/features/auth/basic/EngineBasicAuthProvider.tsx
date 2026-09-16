/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCallback, useEffect, useRef, useState} from "react";
import {type TasklistAuthProviderProps, type User, type UserCredentials} from "../types.ts";
import {useBpmEngine} from "@hooks/useBpmEngine.ts";
import {engineBasicAuthService} from "./engineBasicAuthService.ts";
import {sessionUtils} from "../utils/sessionUtils.ts";
import {TasklistAuthContext} from "../TasklistAuthContext.ts";

/**
 * Provider component for basic authentication with BPM engine credentials.
 * Handles login/logout flows, session restoration, and provides auth context
 * for components requiring basic authentication.
 */
export const EngineBasicAuthProvider = ({children, config}: TasklistAuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasTriedSignin, setHasTriedSignin] = useState(false);
    const [loginError, setLoginError] = useState<Error | null>(null);

    const bpmEngine = useBpmEngine();
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    /**
     * Authenticates user with provided credentials against the BPM engine
     * @param credentials - User login credentials
     * @returns Promise resolving to true if authentication was successful
     */
    const login = async (credentials?: UserCredentials): Promise<boolean> => {
        setIsLoading(true);
        return await engineBasicAuthService.login(credentials, bpmEngine?.selectedEngine)
            .then(result => {
                setLoginError(null);
                if (result) {
                    setToken(sessionUtils.getToken() || null);
                    setUser(engineBasicAuthService.getUser());
                }

                return result;
            })
            .catch((reason: Error) => {
                setLoginError(reason);
                setToken(null);
                return false;
            })
            .finally(() => {
                setIsLoading(false);
                setHasTriedSignin(true);
            });
    };


    const getAuthHeaders = (): Record<string, string> => {
        return engineBasicAuthService.getAuthHeaders();
    };

    /**
     * Logs out user and clears authentication state
     */
    const logout = async (): Promise<void> => {
        await engineBasicAuthService.logout();

        setToken(null);
        setUser(null);
        setLoginError(null);
        setHasTriedSignin(false);
    };

    /**
     * Restores user session from stored session data if available
     */
    const restoreSession = useCallback(() => {
        const session = sessionUtils.getSession();
        const {user: storedUser, token: storedToken, authType: storedType} = session;

        const isSameUser = !userRef.current || (userRef.current.id === storedUser?.id);

        if (storedToken && storedUser && isSameUser && storedType === config.type) {
            setToken(storedToken);
            setUser(storedUser);
        }
        setIsLoading(false);
    }, [config.type]);

    useEffect(() => {
        // Restores a previously persisted session from storage on mount (sync with an external system).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        restoreSession();
    }, [restoreSession]);


    const value = {
        user,
        hasTriedSignin,
        token,
        login,
        logout,
        getAuthHeaders,
        isAuthenticated: !!token,
        isLoading: isLoading,
        authType: config.type,
        loginError
    };

    return (
        <>
            <TasklistAuthContext.Provider value={value}>
                {children}
            </TasklistAuthContext.Provider>
        </>
    );
};