/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCallback} from "react";
import {useQueryParam} from "@hooks/query-params";
import {TASK_URL_PARAM_NAME} from "@utils/query-params/constants.ts";

export const useTaskSelection = () => {
    const { value: selectedTaskId, setValue: setSelectedTask, removeValue: resetSelectedTask } = useQueryParam({
        paramName: TASK_URL_PARAM_NAME,
    });

    const selectTask = useCallback((taskId: string) => {
        if (taskId !== selectedTaskId) {
            setSelectedTask(taskId);
        }
    }, [selectedTaskId, setSelectedTask]);

    const resetTask = useCallback(() => {
        resetSelectedTask();
    }, [resetSelectedTask]);

    return {
        selectedTaskId,
        selectTask,
        resetTask,
    };
};