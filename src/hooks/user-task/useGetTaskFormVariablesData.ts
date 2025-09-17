/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useQuery, type UseQueryOptions, type UseQueryResult} from "@tanstack/react-query";
import {useTasklistClient} from "../useTasklistClient.ts";
import type { GetTaskFormVariablesResult } from "../../features/tasklist-client/types/response.ts";
import type { GetTaskFormVariablesParams } from "../../features/tasklist-client/types/request.ts";


export type UseGetTaskFormVariablesDataQueryOptions = Omit<UseQueryOptions<GetTaskFormVariablesResult, Error, GetTaskFormVariablesResult>, "queryKey" | "queryFn">;
export type UseGetTaskFormVariablesResult = UseQueryResult<GetTaskFormVariablesResult>;

/**
 * Hook to load a user task form data.
 * This hook uses the <code>useQuery</code> hook from the "react-query" library.
 * @param requestParams request params that will be sent to the backend
 * @param queryOptions "react-query" query options
 */
export const useGetTaskFormVariablesData = (requestParams: GetTaskFormVariablesParams, queryOptions: UseGetTaskFormVariablesDataQueryOptions = {}): UseGetTaskFormVariablesResult => {
    const {taskId} = requestParams;
    const taskListClient = useTasklistClient();

    const query: UseQueryResult<GetTaskFormVariablesResult> = useQuery<GetTaskFormVariablesResult, Error, GetTaskFormVariablesResult>({
        queryKey: ["getTaskFormVariables", {id: String(taskId)}],
        queryFn: () => taskListClient.getTaskFormVariables(requestParams),
        ...queryOptions
    });
    return query as UseGetTaskFormVariablesResult;
}