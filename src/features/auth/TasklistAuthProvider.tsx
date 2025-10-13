/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ReactNode} from "react";
import {type TasklistAuthConfig, TasklistAuthType} from "./types.ts";
import {OidcAuthProvider} from "./oidc/OidcAuthProvider.tsx";
import {EngineBasicAuthProvider} from "./basic/EngineBasicAuthProvider.tsx";
import {TasklistAuthContext} from "./TasklistAuthContext.ts";

/**
 * Props for the Tasklist authentication provider component.
 */
export interface TasklistAuthProviderProps {
    /** React children to be wrapped by the auth provider */
    children: ReactNode;
    /** Optional authentication configuration (uses basic auth by default) */
    config?: TasklistAuthConfig;
}

const defaultConfig: TasklistAuthConfig = {
    type: TasklistAuthType.BASIC
};

/**
 * Provides authentication context for Tasklist components with configurable auth types.
 * Basic and OIDC types of authentication are supported.
 * @see EngineBasicAuthProvider
 * @see OidcAuthProvider
 */
export const TasklistAuthProvider = ({children, config: configFromProps}: TasklistAuthProviderProps) => {
    const config = configFromProps || defaultConfig;
    const authType = config.type;

    if (config.type == TasklistAuthType.BASIC) {
        return <EngineBasicAuthProvider config={config}>
            {children}
        </EngineBasicAuthProvider>
    }

    if (authType === TasklistAuthType.OIDC) {
        return <OidcAuthProvider config={config}>;
            {children}
        </OidcAuthProvider>
    }

    return (
        <TasklistAuthContext.Provider value={null}>
            {children}
        </TasklistAuthContext.Provider>
    );
};