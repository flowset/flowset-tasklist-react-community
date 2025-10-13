/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import { AuthProvider } from "react-oidc-context";
import type { ReactNode } from "react";
import type { TasklistAuthConfig } from "../types.ts";
import { OidcAuthProviderWrapper } from "./OidcAuthProviderWrapper.tsx";

/**
 * Props for the OIDC authentication provider component
 */
interface OidcAuthProviderProps {
    /**
     * React children to be wrapped by the OIDC provider
     */
    children: ReactNode;
    /**
     * Authentication configuration containing OIDC settings
     */
    config: TasklistAuthConfig;
}

/**
 * OIDC authentication provider wrapper that integrates with react-oidc-context
 */
export const OidcAuthProvider = ({ children, config }: OidcAuthProviderProps) => {
    const oidcConfig = config.oidcConfig;

    return (
        <AuthProvider {...oidcConfig}>
            <OidcAuthProviderWrapper config={config}>
                {children}
            </OidcAuthProviderWrapper>
        </AuthProvider>
    );
};