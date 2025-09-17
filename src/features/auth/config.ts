/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {type TasklistAuthConfig, TasklistAuthType} from "./types.ts";
import {UserManager, WebStorageStateStore} from "oidc-client-ts";
import {getEnv} from "../../utils/env/env.ts";

export const DEFAULT_AUTH_CONFIG: TasklistAuthConfig = {
    type: TasklistAuthType.BASIC
}

export const parseAuthTypeFromEnv = (envConfig?: string): TasklistAuthType | undefined => {
    if (!envConfig || envConfig === 'undefined' || envConfig === '') {
        return undefined;
    }

    return envConfig.toUpperCase() as TasklistAuthType;
}

export const getAuthConfigByType = (envConfig?: string) => {
    const authType = parseAuthTypeFromEnv(envConfig);

    if (authType === TasklistAuthType.OIDC) {
        return {
            type: authType,
            oidcConfig: {
                userManager: new UserManager({
                    authority: getEnv("VITE_OIDC_REALM_URL") ?? "http://localhost:9081/realms/my-realm",
                    client_id: getEnv("VITE_OIDC_CLIENT_ID") ?? "client-id",
                    redirect_uri:  getEnv("VITE_OIDC_REDIRECT_URI") ?? "http://localhost:3000/",
                    post_logout_redirect_uri: window.location.origin,
                    scope: 'openid profile',
                    userStore: new WebStorageStateStore({
                        store: window.localStorage
                    }),
                    stateStore: new WebStorageStateStore({
                        store: window.sessionStorage
                    })
                }),
                onSigninCallback: () => {
                    window.history.replaceState({}, document.title, window.location.pathname);
                },

                avatarClaim:  getEnv("VITE_OIDC_AVATAR_CLAIM")
            }
        }
    }

    return authType ? {type: authType} : DEFAULT_AUTH_CONFIG;
}