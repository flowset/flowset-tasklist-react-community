/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCallback, useRef} from "react";
import type {FormJsFormViewer, SubmitEventData} from "@components/form/form-js/types/FormJsFormViewer.ts";
import {Flex, Space} from "antd";
import {DeployedJsonForm} from "@components/form/DeployedJsonForm.tsx";
import {StartProcessButton} from "@components/button/StartProcessButton.tsx";
import {CancelButton} from "@components/button/CancelButton.tsx";
import {createStyles} from "antd-style";
import type {ProcessFormData} from "@models/form.ts";
import {USE_DEPLOYED_FORM_STUB} from "@features/tasklist-client/stubs/deployed-form-stub.ts";

const useStyles = createStyles(({css}) => ({
    formContainer: css`
        width: 100%;
    `,

    formJsActionsContainer: css`
        width: 100%;
    `,
}));

export interface StartFormJsFormProps {
    formData?: ProcessFormData;
    onStart: (variables?: Record<string, unknown>, businessKey?: string) => void;
    onCancel: () => void;
    startInProgress?: boolean;
}

export const StartFormJsForm = ({formData, onStart, startInProgress, onCancel}: StartFormJsFormProps) => {
    const formRef = useRef<FormJsFormViewer | null>(null);
    const {styles} = useStyles();

    const handleFormJsFormSubmit = useCallback((event: SubmitEventData) => {
        if (!event.errors || Object.keys(event.errors).length === 0) {
            onStart(event.data);
        }
    }, [onStart]);

    const onStartButtonClick = useCallback(() => {
        formRef.current?.submit();
    }, []);

    return (
        <>
            <Space direction="vertical" className={styles.formContainer}>
                <DeployedJsonForm ref={formRef} form={formData}
                                  onSubmit={handleFormJsFormSubmit}/>
                <Flex gap="middle" className={styles.formJsActionsContainer}>
                    {!USE_DEPLOYED_FORM_STUB &&
                        <StartProcessButton key="submit" type="primary" onClick={onStartButtonClick}
                                            loading={startInProgress}/>}
                    <CancelButton key="cancel" onClick={onCancel}/>
                </Flex>
            </Space>
        </>
    );
};