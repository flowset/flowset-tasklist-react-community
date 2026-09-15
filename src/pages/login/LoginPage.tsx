/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Button, Form, type FormProps, Input, Space, Typography} from "antd";
import {useTasklistAuth} from "@hooks/useTasklistAuth.ts";
import Icon from "@ant-design/icons";
import {LogoIcon} from "@components/LogoIcon.tsx";
import {useTranslation} from "react-i18next";
import type {UserCredentials} from "@features/auth/types.ts";
import {HttpError} from "@utils/errors/HttpError.ts";
import {useLoginPageStyles} from "./useLoginPageStyles.ts";

const {Title, Text} = Typography;

export const LoginPage = () => {
    const {isLoading, login, loginError} = useTasklistAuth();
    const {t: translate} = useTranslation("loginForm");
    const {styles} = useLoginPageStyles(loginError);

    const onFinish: FormProps<UserCredentials>["onFinish"] = (values) => {
        login({
            username: values.username,
            password: values.password,
        });
    };

    return (
        <>
            <div className={styles.loginFormMainLayout}>
                <div className={styles.loginFormRoot}>
                    <Space orientation="vertical" style={{height: "100%"}} wrap={true} size="large" align="center">
                        <LoginFormHeader/>
                        <Form
                            onFinish={onFinish}
                            layout="vertical">
                            <Form.Item<UserCredentials> name="username"
                                                        label={translate("username.label")}
                                                        rules={[{
                                                            required: true,
                                                            message: translate("username.validation.required")
                                                        }]}>
                                <Input/>
                            </Form.Item>

                            <Form.Item<UserCredentials>
                                name="password"
                                label={translate("password.label")}
                                className={styles.passwordField}
                                rules={[{
                                    required: true,
                                    message: translate("password.validation.required")
                                }]}>
                                <Input.Password/>
                            </Form.Item>

                            <div className={styles.errorContainer}>
                                {loginError && <LoginErrorText error={loginError}/>}
                            </div>
                            <Form.Item label={null} style={{marginBottom: 0, width: "100%"}}>
                                <Button type="primary" htmlType="submit"
                                        loading={isLoading} style={{width: "100%", marginTop: "1em"}}>
                                    {translate("loginButton.label")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>
                </div>

            </div>
        </>
    );
};

const LoginFormHeader = () => {
    const {styles} = useLoginPageStyles();
    return (
        <>
            <Space orientation="horizontal" align="start">
                <Icon component={LogoIcon} className={styles.logoIcon}/>
                <Title level={3} className={styles.headerTitle}>Flowset Tasklist</Title>
            </Space>
        </>
    );
};

interface LoginErrorProps {
    error: Error;
}

const LoginErrorText = ({error}: LoginErrorProps) => {
    const isHttpError = error instanceof HttpError;
    const {t: translate} = useTranslation("loginForm");
    let errorMessage;

    if (!isHttpError) {
        errorMessage = error.message;
    } else if (error.status && [401, 403, 500].includes(error.status)) {
        errorMessage = translate(`httpError.${error.status}.description`);
    } else {
        errorMessage = `${error.status} ${error.statusText}`;
    }

    return (
        <>
            <Text type="danger">{errorMessage}</Text>
        </>
    );
};