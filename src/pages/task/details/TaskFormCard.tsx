/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Flex, notification} from "antd";
import {useCallback, useRef} from "react";
import "@bpmn-io/form-js-viewer/dist/assets/form-js.css";
import {useSubmitTaskForm} from "@hooks/user-task";
import {EmbeddedForm} from "@components/form/EmbeddedForm.tsx";
import {CustomForm} from "@components/form/CustomForm.tsx";
import {useTranslation} from "react-i18next";
import {CompleteTaskButton} from "@components/button/CompleteTaskButton.tsx";
import type {FormJsFormViewer, SubmitEventData} from "@components/form/form-js/types/FormJsFormViewer.ts";
import {DeployedJsonForm} from "@components/form/DeployedJsonForm.tsx";
import {createStyles} from "antd-style";
import {FormType, type InitialData, type ProcessFormData} from "@models/form.ts";
import type {UserTask} from "@models/user-task.ts";
import {USE_DEPLOYED_FORM_STUB} from "@features/tasklist-client/stubs/deployed-form-stub.ts";

const useStyles = createStyles(({css}) => ({
    defaultActionsContainer: css`
        margin: 0;
    `,
}));


export interface TaskFormCardProps {
    task?: UserTask;
    formData?: ProcessFormData | null;
    initialData?: InitialData;
    onTaskCompleteSuccess: (task: UserTask) => void;
    onTaskClose: () => void;
}

export const TaskFormCard = (props: TaskFormCardProps) => {
    const {task, formData, initialData, onTaskCompleteSuccess, onTaskClose} = props;

    const [api, contextHolder] = notification.useNotification();
    const {mutateAsync: submitTaskForm, isPending} = useSubmitTaskForm();
    const {t: translate} = useTranslation(["userTask"]);
    const {styles} = useStyles();

    const formType = formData?.type;

    const completeTaskWithVariables = useCallback(async (variables?: Record<string, unknown>) => {
        if (task) {
            await submitTaskForm({
                taskId: task.id,
                data: variables
            })
                .then(() => {
                    onTaskCompleteSuccess(task);
                }).catch((error: Error) => {
                    console.log("Error on task complete: ", error);
                    api.error({
                        message: translate("detailPage.taskNotCompleted", {
                            taskName: task.name
                        }),
                        placement: "top",
                        duration: 3
                    });
                });
        }
    }, [task, submitTaskForm, onTaskCompleteSuccess, api, translate]);

    const handleDefaultComplete = useCallback(() => {
        completeTaskWithVariables();
    }, [completeTaskWithVariables]);

    const showCompleteButton = !formData || !formType;
    return (
        <>
            {contextHolder}
            <Card variant={"outlined"}>
                {formType == FormType.EMBEDDED && <EmbeddedForm/>}
                {formType == FormType.FORM_JS_JSON && <FormJsFormCard formData={formData} initialData={initialData}
                                                                      onTaskComplete={completeTaskWithVariables}
                                                                      completeInProgress={isPending}
                />}
                {formType == FormType.CUSTOM && formData && <CustomForm formData={formData}
                                                                        task={task}
                                                                        inputVariables={initialData}
                                                                        onCancel={onTaskClose}
                                                                        onSubmit={completeTaskWithVariables}
                />
                }
                {showCompleteButton &&
                    <Flex align="center" justify="start" className={styles.defaultActionsContainer}>
                        <CompleteTaskButton onClick={handleDefaultComplete} loading={isPending}/>
                    </Flex>
                }

            </Card>
        </>
    )

};

export interface FormJsFormCardProps {
    formData?: ProcessFormData | null;
    initialData?: InitialData;
    onTaskComplete: (variables?: Record<string, unknown>) => void;
    completeInProgress?: boolean;
}

export const FormJsFormCard = ({formData, initialData, onTaskComplete, completeInProgress}: FormJsFormCardProps) => {
    const formRef = useRef<FormJsFormViewer | null>(null);

    const handleFormJsFormSubmit = useCallback((event: SubmitEventData) => {
        if (!event.errors || Object.keys(event.errors).length === 0) {
            onTaskComplete(event.data);
        }
    }, [onTaskComplete]);

    const handleTaskComplete = useCallback(() => {
        formRef.current?.submit();
    }, []);

    return (
        <>
            <DeployedJsonForm ref={formRef} form={formData}
                              initialData={initialData}
                              onSubmit={handleFormJsFormSubmit}/>
            {!USE_DEPLOYED_FORM_STUB &&
                <CompleteTaskButton onClick={handleTaskComplete} loading={completeInProgress}/>}
        </>
    );
};
