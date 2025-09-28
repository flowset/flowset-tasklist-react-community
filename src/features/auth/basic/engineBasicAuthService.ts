/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {type EngineBasicAuthService, TasklistAuthType, type User, type UserCredentials} from "../types.ts";
import {type BpmEngineConfig, EngineType} from "../../bpm-engine/types.ts";
import {HttpError} from "../errors/HttpError.ts";
import {sessionUtils} from "../utils/sessionUtils.ts";
import { getEnvUrl } from "../../tasklist-client/http/fetch-utils.ts";

const encodeCredentials = (credentials: UserCredentials) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${credentials.username}:${credentials.password}`);
    return btoa(String.fromCharCode(...data));
}

const getUserEndpoint = (
    engineType: EngineType,
    username: string
): string | undefined => {
    const endpoints: Record<EngineType, string | undefined> = {
        [EngineType.CAMUNDA_7]: `/user/${username}/profile`,
        [EngineType.OPERATON]: `/user/${username}/profile`
    };

    return endpoints[engineType];
};

export const engineBasicAuthService: EngineBasicAuthService = {

    async login(credentials?: UserCredentials, bpmEngineSettings?: BpmEngineConfig): Promise<boolean> {
        if (!credentials || !bpmEngineSettings) {
            return false;
        }

        const basicAuthValues = encodeCredentials(credentials);
        const userEndpoint = bpmEngineSettings.apiUrl + getUserEndpoint(bpmEngineSettings.type, credentials.username);

        if (!userEndpoint) {
            throw new Error(`Unsupported engine type: ${bpmEngineSettings.type}`);
        }

        try {
            const response = await fetch(getEnvUrl(userEndpoint), {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${basicAuthValues}`
                }
            });

            if (!response.ok) {
                console.error("Error response:", response);
                throw new HttpError(response.status, response.statusText, `Authentication failed: ${response.status} ${response.statusText}`);
            }

            const userData: User = await response.json();
            const resultUser = {
                ...userData,
                username: credentials.username,
            }
            sessionUtils.saveSession({
                user: resultUser,
                token: basicAuthValues,
                authType: TasklistAuthType.BASIC
            });
            return true;

        } catch (error) {
            if (!(error instanceof HttpError)) {
                console.error('Login error:', error);
            }

            throw error;
        }
    },

    async logout(): Promise<void> {
        sessionUtils.clearSession();
    },

    getUser(): User | null {
        const storedAuthData = sessionUtils.getSession();
        return storedAuthData.authType === TasklistAuthType.BASIC ? storedAuthData.user : null;
    },

    getAuthHeaders(): Record<string, string> {
        let headers: Record<string, string> = {};
        const token = sessionUtils.getToken();
        headers = {
            'Authorization': `Basic ${token}`
        }
        return headers;
    },

    getToken(): string | null {
        return sessionUtils.getToken();
    },

    isAuthenticated(): boolean {
        return sessionUtils.isValidSession(TasklistAuthType.BASIC);
    }
};
