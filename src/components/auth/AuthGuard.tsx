/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useTasklistAuth} from "@hooks/useTasklistAuth.ts";
import {TasklistAuthType} from "@features/auth/types.ts";
import {LoginPage} from "@pages/login/LoginPage.tsx";
import {SplashScreen} from "@components/auth/SplashScreen.tsx";
import {useTranslation} from "react-i18next";
import {Button, Space, Typography} from "antd";
import {useCallback, type ReactNode} from "react";

const {Title, Text} = Typography;

interface AuthGuardProps {
    children: ReactNode;
}

export const AuthGuard = ({children}: AuthGuardProps) => {
    const {authType, isAuthenticated, isLoading, hasTriedSignin, loginError} = useTasklistAuth();
    const {t: translate} = useTranslation("loginForm");

    const handleReloadPage = useCallback(() => {
        window.location.reload();
    }, []);

    if (authType == TasklistAuthType.BASIC && !isAuthenticated) {
        return <LoginPage/>
    }

    if (authType == TasklistAuthType.OIDC && isLoading) {
        return <SplashScreen/>
    }

    if (authType == TasklistAuthType.OIDC && !isAuthenticated) {
        if (hasTriedSignin || loginError) {
            return (
                <Space direction="vertical">
                    <Title level={4}>{translate("unableLogin")}</Title>
                    {loginError && <Text>{loginError.message}</Text>}
                    <Button onClick={handleReloadPage}>
                        {translate("tryAgainButton.label")}
                    </Button>
                </Space>
            );
        }
        return null
    }

    if (authType === TasklistAuthType.OIDC && !isAuthenticated && !hasTriedSignin) {
        return <SplashScreen/>
    }

    return <>{children}</>;
};
