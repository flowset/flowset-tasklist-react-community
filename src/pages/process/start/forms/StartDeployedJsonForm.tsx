/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCallback, useRef} from "react";
import type {FormViewerHandle, SubmitEventData} from "@components/form/formengine/types/FormViewerHandle.ts";
import {Flex, Space} from "antd";
import {DeployedJsonForm} from "@components/form/DeployedJsonForm.tsx";
import {StartProcessButton} from "@components/button/StartProcessButton.tsx";
import {CancelButton} from "@components/button/CancelButton.tsx";
import {createStyles} from "antd-style";
import type {ProcessFormData} from "@models/form.ts";

const useStyles = createStyles(({css}) => ({
    formContainer: css`
        width: 100%;
    `,

    formActionsContainer: css`
        width: 100%;
    `,
}));

export interface StartDeployedJsonFormProps {
    formData?: ProcessFormData;
    onStart: (variables?: Record<string, unknown>, businessKey?: string) => void;
    onCancel: () => void;
    startInProgress?: boolean;
}

export const StartDeployedJsonForm = ({formData, onStart, startInProgress, onCancel}: StartDeployedJsonFormProps) => {
    const formRef = useRef<FormViewerHandle | null>(null);
    const {styles} = useStyles();

    const handleFormSubmit = useCallback((event: SubmitEventData) => {
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
                                  onSubmit={handleFormSubmit}/>
                <Flex gap="middle" className={styles.formActionsContainer}>
                    <StartProcessButton key="submit" type="primary" onClick={onStartButtonClick}
                                        loading={startInProgress}/>
                    <CancelButton key="cancel" onClick={onCancel}/>
                </Flex>
            </Space>
        </>
    );
};
