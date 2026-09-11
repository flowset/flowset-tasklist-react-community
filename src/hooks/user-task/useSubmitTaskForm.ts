/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useMutation, type UseMutationOptions, type UseMutationResult, useQueryClient} from "@tanstack/react-query";
import {useRef} from "react";
import {useTasklistClient} from "../useTasklistClient.ts";
import type {CompleteTaskData, CompleteTaskParams} from "@features/tasklist-client/types/request.ts";
import type {CompeteUserTaskResult} from "@features/tasklist-client/types/response.ts";
import dayjs from "dayjs";
import {formatOffsetDateTime} from "@utils/format";

/**
 * Hook to get an array containing a function to submit a user task form and the result of the mutation execution.
 * This hook uses the <code>useMutation</code> hook from the "react-query" library.
 * @param requestParams request params that will be sent to the backend
 * @param mutationOptions "react-query" mutation options
 */
export const useSubmitTaskForm = (requestParams: Partial<CompleteTaskParams> = {}, mutationOptions: UseSubmitTaskFormMutationOptions = {}): UseSubmitTaskFormResult => {
    const taskListClient = useTasklistClient();
    const paramsRef = useRef<Partial<CompleteTaskParams>>(requestParams);
    const {onSuccess, ...restOptions} = mutationOptions;
    const queryClient = useQueryClient();

    const transformData = (data?: CompleteTaskData) => {
        if (!data) {
            return undefined;
        }
        const transformed = {...data};
        Object.entries(transformed).forEach(([key, value]) => {
            if (dayjs.isDayjs(value)) {
                transformed[key] = formatOffsetDateTime(value);
            }
        });

        return transformed;
    };

    return useMutation<CompeteUserTaskResult, Error, UseSubmitTaskFormParams>({
        mutationFn: (callTimeParams) => {
            const callTimeId = typeof callTimeParams === "object" ? callTimeParams.taskId : undefined;
            const callTimeData = typeof callTimeParams === "object" ? callTimeParams.data : undefined;

            return taskListClient.submitTaskForm({
                taskId: callTimeId || paramsRef.current.taskId || "",
                data: transformData(callTimeData || paramsRef.current.data),
            })
        },
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({queryKey: ["getUserTasks"]});
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...restOptions
    });
};
export type EmptySubmitTaskFormParams = void;
export type UseSubmitTaskFormParams = Partial<CompleteTaskParams> | EmptySubmitTaskFormParams;

export type UseSubmitTaskFormMutationOptions = Omit<UseMutationOptions<CompeteUserTaskResult, Error, UseSubmitTaskFormParams>, "mutationFn">;

export type UseSubmitTaskFormResult = UseMutationResult<CompeteUserTaskResult, Error, UseSubmitTaskFormParams>;
