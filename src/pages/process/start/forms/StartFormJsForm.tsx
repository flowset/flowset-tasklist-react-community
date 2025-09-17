/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCallback, useRef} from "react";
import type {FormJsFormViewer, SubmitEventData} from "../../../../components/form/form-js/types/FormJsFormViewer.ts";
import {Flex, Space} from "antd";
import {FormJsForm} from "../../../../components/form/form-js/FormJsForm.tsx";
import {StartProcessButton} from "../../../../components/button/StartProcessButton.tsx";
import {CancelButton} from "../../../../components/button/CancelButton.tsx";
import {createStyles} from "antd-style";
import type {ProcessFormData} from "../../../../types/common.ts";

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
                <FormJsForm ref={formRef} form={formData}
                            onSubmit={handleFormJsFormSubmit}/>
                <Flex gap="middle" className={styles.formJsActionsContainer}>
                    <StartProcessButton key="submit" type="primary" onClick={onStartButtonClick}
                                        loading={startInProgress}/>
                    <CancelButton key="cancel" onClick={onCancel}/>
                </Flex>
            </Space>
        </>
    );
};