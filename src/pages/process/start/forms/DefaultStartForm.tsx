/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Flex, Form, Input} from "antd";
import {useTranslation} from "react-i18next";
import {useCallback} from "react";
import {StartProcessButton} from "../../../../components/button/StartProcessButton.tsx";
import {CancelButton} from "../../../../components/button/CancelButton.tsx";
import {createStyles} from "antd-style";


const useStyles = createStyles(({css}) => ({
    defaultFormContainer: css`
        width: 100%;
        height: 100%;
    `,
    defaultFormBusinessKeyItem: css`
        margin-bottom: 3em;
    `,
    defaultFormActions: css`
        margin-bottom: 0;
    `
}));
interface DefaultFormFieldValues {
    businessKey?: string;
}

export interface DefaultStartFormProps {
    onCancel: () => void;
    onStart: (variables?: Record<string, unknown>, businessKey?: string) => void;
    startInProgress?: boolean;
}


export const DefaultStartForm = (props: DefaultStartFormProps) => {
    const [form] = Form.useForm();
    const {onStart, startInProgress, onCancel} = props;
    const {t: translate} = useTranslation(["process"]);
    const {styles} = useStyles();


    const handleFormSubmit = useCallback((fieldValues: DefaultFormFieldValues) => {
        onStart(undefined, fieldValues.businessKey);
    }, [onStart]);

    return (
        <>
            <Form<DefaultFormFieldValues> form={form} layout="vertical" onFinish={handleFormSubmit} size={"middle"}
                                          className={styles.defaultFormContainer}>
                <Form.Item name="businessKey" className={styles.defaultFormBusinessKeyItem}
                           label={translate("process:startDialog.fields.businessKey.label")}
                           help={translate("process:startDialog.fields.businessKey.helpText")}>
                    <Input/>
                </Form.Item>
                <Form.Item className={styles.defaultFormActions}>
                    <Flex gap="middle">
                        <StartProcessButton htmlType="submit" type="primary" loading={startInProgress}/>
                        <CancelButton key="cancel" onClick={onCancel}/>
                    </Flex>
                </Form.Item>
            </Form>
        </>
    );
};