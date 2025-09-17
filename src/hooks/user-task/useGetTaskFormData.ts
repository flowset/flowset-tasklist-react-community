/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useQuery, type UseQueryOptions, type UseQueryResult} from "@tanstack/react-query";
import {useTasklistClient} from "../useTasklistClient.ts";
import type {GetTaskFormResult} from "../../features/tasklist-client/types/response.ts";
import type {GetTaskFormDataParams} from "../../features/tasklist-client/types/request.ts";


export type UseGetTaskFormDataQueryOptions = Omit<UseQueryOptions<GetTaskFormResult, Error, GetTaskFormResult>, "queryKey" | "queryFn">;
export type UseGetTaskFormDataResult = UseQueryResult<GetTaskFormResult>;

/**
 * Hook to load a user task form data.
 * This hook uses the <code>useQuery</code> hook from the "react-query" library.
 * @param requestParams request params that will be sent to the backend
 * @param queryOptions "react-query" query options
 */
export const useGetTaskFormData = (requestParams: GetTaskFormDataParams, queryOptions: UseGetTaskFormDataQueryOptions = {}): UseGetTaskFormDataResult => {
    const {taskId} = requestParams;
    const taskListClient = useTasklistClient();


    const query: UseQueryResult<GetTaskFormResult> = useQuery<GetTaskFormResult, Error, GetTaskFormResult>({
        queryKey: ["getTaskFormData", {id: String(taskId)}],
        queryFn: () => taskListClient.getTaskFormData(requestParams),
        ...queryOptions
    });
    return query as UseGetTaskFormDataResult;
}