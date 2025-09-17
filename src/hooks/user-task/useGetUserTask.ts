/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useQuery, type UseQueryOptions, type UseQueryResult} from "@tanstack/react-query";
import {useTasklistClient} from "../useTasklistClient.ts";
import type { GetUserTaskResult } from "../../features/tasklist-client/types/response.ts";
import type {GetUserTaskParams} from "../../features/tasklist-client/types/request.ts";


export type UseGetUserTaskQueryOptions = Omit<UseQueryOptions<GetUserTaskResult, Error, GetUserTaskResult>, "queryKey" | "queryFn">;
export type UseGetUserTaskResult = UseQueryResult<GetUserTaskResult>;

/**
 * Hook to load a user task by id from backend.
 * This hook uses the <code>useQuery</code> hook from the "react-query" library.
 * @param requestParams request params that will be sent to backend
 * @param queryOptions "react-query" query options
 */
export const useGetUserTask = (requestParams: GetUserTaskParams, queryOptions: UseGetUserTaskQueryOptions = {}): UseGetUserTaskResult => {
    const {taskId} = requestParams;
    const taskListClient = useTasklistClient();

    const query: UseQueryResult<GetUserTaskResult> = useQuery<GetUserTaskResult, Error, GetUserTaskResult>(
        {
            queryKey: ["getUserTask", {id: String(taskId)}], // eslint-disable-line
            queryFn: () => taskListClient.getUserTaskById(requestParams),
            ...queryOptions
        }
    );
    return query as UseGetUserTaskResult;
}