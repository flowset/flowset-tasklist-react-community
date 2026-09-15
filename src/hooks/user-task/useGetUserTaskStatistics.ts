/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useQuery, type UseQueryOptions, type UseQueryResult} from "@tanstack/react-query";
import {useTasklistClient} from "../useTasklistClient.ts";
import type { GetUserTaskStatisticsResult } from "@features/tasklist-client/types/response.ts";
import type {GetUserTaskStatisticsParams} from "@features/tasklist-client/types/request.ts";

export type UseGetUserTaskStatisticsParams = GetUserTaskStatisticsParams;
export type UseGetUserTaskStatisticsQueryOptions = Omit<UseQueryOptions<GetUserTaskStatisticsResult, Error, GetUserTaskStatisticsResult>, "queryKey" | "queryFn">;
export type UseGetUserTaskStatisticsResult = UseQueryResult<GetUserTaskStatisticsResult>;

/**
 * Hook to load a task execution statistics for the current user from backend.
 * This hook uses <code>useQuery</code> hook from the "react-query" library.
 * @param requestParams request params that will be sent to backend
 * @param queryOptions "react-query" query options
 */
export const useGetUserTaskStatistics = (requestParams: UseGetUserTaskStatisticsParams = {},
                                         queryOptions?: UseGetUserTaskStatisticsQueryOptions): UseGetUserTaskStatisticsResult => {
    const taskListClient = useTasklistClient();

    const query: UseQueryResult<GetUserTaskStatisticsResult> = useQuery<GetUserTaskStatisticsResult, Error, GetUserTaskStatisticsResult>(
        {
            queryKey: ["getUserTaskStatistics", requestParams.username],
            queryFn: () => taskListClient.getUserTaskStatistics(requestParams),
            ...queryOptions
        }
    );
    return query as UseGetUserTaskStatisticsResult;
};