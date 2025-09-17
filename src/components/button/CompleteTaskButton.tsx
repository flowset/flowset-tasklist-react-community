/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import Button from "antd/es/button";
import {CheckOutlined} from "@ant-design/icons";
import type {ButtonProps} from "antd/lib";
import {useSubmitTaskForm} from "../../hooks/user-task/useSubmitTaskForm.ts";
import {useCallback} from "react";
import {useTranslation} from "react-i18next";

export interface CompleteTaskButtonProps {
    taskId?: string;
    variables?: Record<string, unknown>;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const CompleteTaskButton = (props: CompleteTaskButtonProps & ButtonProps) => {
    const {taskId, variables, icon, type, onSuccess, onError, onClick, ...restProps} = props;
    const {mutateAsync: submitTaskForm, isPending} = useSubmitTaskForm({},
        {});
    const {t: translate} = useTranslation(["userTask"]);

    const onCompleteButtonClick = useCallback(async () => {
        await submitTaskForm({
            taskId: taskId,
            data: variables
        })
            .then(() => {
                if (onSuccess) {
                    onSuccess();
                }
            }).catch((error: Error) => {
                console.log("Error on task complete: ", error);
                if (onError) {
                    onError(error);
                }
            });
    }, [submitTaskForm, taskId, variables, onSuccess, onError]);

    return (
        <>
            <Button type={type || "primary"} icon={icon || <CheckOutlined/>} onClick={onClick || onCompleteButtonClick}
                    loading={isPending} {...restProps}>{translate("actions.complete")}</Button>
        </>
    );
};