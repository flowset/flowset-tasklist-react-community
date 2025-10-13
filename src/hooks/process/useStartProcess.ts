/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useMutation, type UseMutationOptions, type UseMutationResult, useQueryClient} from "@tanstack/react-query";
import {useRef} from "react";
import {useTasklistClient} from "../useTasklistClient.ts";
import type { StartProcessParams } from "@features/tasklist-client/types/request.ts";
import type {StartProcessResult} from "@features/tasklist-client/types/response.ts";

/**
 * Hook to get an array containing a function to start a process and the result of the mutation execution.
 * This hook uses the <code>useMutation</code> hook from the "react-query" library.
 * @param requestParams  request params that will be sent to backend
 * @param mutationOptions "react-query" mutation options
 */
export const useStartProcess = (requestParams: Partial<StartProcessParams> = {}, mutationOptions: UseStartProcessMutationOptions = {}): UseStartProcessResult => {
    const taskListClient = useTasklistClient();
    const paramsRef = useRef<Partial<StartProcessParams>>(requestParams);
    const {onSuccess, ...restOptions} = mutationOptions;
    const queryClient = useQueryClient();

    return useMutation<StartProcessResult, Error, UseStartProcessParams>({
        mutationFn: (callParams) => {
            const callTimeKey = typeof callParams === "object" ? callParams.processDefinitionId : undefined;
            const callTimeVariables = typeof callParams === "object" ? callParams.variables : undefined;
            const callBusinessKey = typeof callParams === "object" ? callParams.businessKey : undefined;

            return taskListClient.startProcess({
                processDefinitionId: callTimeKey || paramsRef.current.processDefinitionId || "",
                variables: callTimeVariables || paramsRef.current.variables,
                businessKey: callBusinessKey || paramsRef.current.businessKey
            });
        },
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({queryKey: ["getUserProcessInstances"]});
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...restOptions
    });
};
export type EmptyStartProcessParams = void;
export type UseStartProcessParams = Partial<StartProcessParams> | EmptyStartProcessParams;

export type UseStartProcessMutationOptions = Omit<UseMutationOptions<StartProcessResult, Error, UseStartProcessParams>, "mutationFn">;

export type UseStartProcessResult = UseMutationResult<StartProcessResult, Error, UseStartProcessParams>;