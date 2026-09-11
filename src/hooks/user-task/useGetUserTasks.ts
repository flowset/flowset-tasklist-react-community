
/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useQuery, useQueryClient, type UseQueryOptions, type UseQueryResult} from "@tanstack/react-query";
import {useEffect, useMemo} from "react";
import {useTasklistClient} from "../useTasklistClient.ts";
import {useTasklistAuth} from "../useTasklistAuth.ts";
import {
    type PaginationPayload,
    SortOrder,
    type SortPayload,
} from "@models/common.ts";
import type {GetTaskListResult, GetUserTaskListResult} from "@features/tasklist-client/types/response.ts";
import type {GetUserTaskListParams} from "@features/tasklist-client/types/request.ts";
import type {TaskFilterPayload, UserTask} from "@models/user-task.ts";

const MAX_DATA_LENGTH_TO_CACHE = 100;
/**
 * Default first page number for pagination (1-based)
 */
const DEFAULT_FIRST_PAGE_NUMBER = 1;

/**
 * Query options for fetching user tasks, excluding queryKey and queryFn from standard useQuery options.
 */
export type UseGetUserTasksQueryOptions = Omit<UseQueryOptions<GetUserTaskListResult, Error, GetUserTaskListResult>, "queryKey" | "queryFn">;

/**
 * Parameters for the useGetUserTasks hook including filtering, sorting, pagination and initial page number.
 */
export type UseGetUserTasksParams = GetUserTaskListParams & {
    /**
     * Starting page number for pagination (0 or 1-based)
     */
    firstPageNumber?: 0 | 1
}

/**
 * Return value from useGetUserTasks hook extending a standard query result with pagination information
 */
export type UseGetUserTasksResult = UseQueryResult<GetUserTaskListResult> & {
    /**
     * Pagination metadata including page navigation and total pages
     */
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
        totalPages?: number;
    };
};

/**
 * Default empty filter payload for task queries
 */
const defaultFilter: TaskFilterPayload = {};
/**
 * Default sort configuration by creation date in descending order
 */
const defaultSort: SortPayload = {property: "createDate", order: SortOrder.Desc};
/**
 * Default pagination configuration with the first page and 10 items per page
 */
const defaultPagination: PaginationPayload = {page: 1, size: 10};

/**
 * Hook to load a paginated user task list assigned to the current user from backend.
 * This hook uses <code>useQuery</code> hook from the "react-query" library.
 * @param requestParams request params that will be sent to backend
 * @param queryOptions "react-query" query options
 */
export const useGetUserTasks = (requestParams: UseGetUserTasksParams = {}, queryOptions?: UseGetUserTasksQueryOptions): UseGetUserTasksResult => {
    const {
        pagination = defaultPagination,
        sort = defaultSort,
        filter = defaultFilter,
        firstPageNumber = DEFAULT_FIRST_PAGE_NUMBER
    } = requestParams;

    const taskListClient = useTasklistClient();
    const queryClient = useQueryClient();
    const {user} = useTasklistAuth();
    const resultPagination: PaginationPayload = {
        ...pagination,
        page: pagination.page - firstPageNumber
    };

    const queryKeyFilter = {
        ...filter,
        dueDateBefore: clearSeconds(filter.dueDateBefore),
        dueDateAfter: clearSeconds(filter.dueDateAfter),
        createDateBefore: clearSeconds(filter.createDateBefore),
        createDateAfter: clearSeconds(filter.createDateAfter)
    };

    const currentUsername = requestParams.username || user?.username;
    const resultParams = {...requestParams, pagination: resultPagination, username: currentUsername};

    const result: UseQueryResult<GetUserTaskListResult> = useQuery<GetUserTaskListResult, Error, GetUserTaskListResult>({
        queryKey: ["getUserTasks", currentUsername, pagination, sort, queryKeyFilter],
        queryFn: () => taskListClient.getUserTasks(resultParams),
        ...queryOptions,
    });

    useEffect(() => {
        if (
            result.data === undefined ||
            result.error != null ||
            result.isFetching
        )
            return;

        // optimistically populate the getUserTask cache
        if (
            result.data?.data &&
            result.data?.data.length <= MAX_DATA_LENGTH_TO_CACHE
        ) {
            result.data?.data.forEach(task => {
                queryClient.setQueryData(
                    ["getUserTask", {id: task.id}],
                    (oldRecord: UserTask) => oldRecord ?? task
                );
            });
        }
    }, [
        queryClient,
        result.data,
        result.error,
        result.isFetching,
    ]);

    return useMemo(
        () =>
            result.data
                ? {
                    ...result,
                    pageInfo: {
                        hasNextPage: (firstPageNumber === 0 ? pagination.page + 1 : pagination.page) * pagination.size < result.data.totalElements,
                        hasPreviousPage: pagination.page > firstPageNumber,
                        totalPages: Math.ceil(result.data.totalElements / pagination.size)
                    },
                }
                : result,
        [firstPageNumber, pagination.page, pagination.size, result]
    ) as UseQueryResult<GetTaskListResult> & {
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
            totalPages?: number;
        };
    };
};

const clearSeconds = (dateString?: string) => {
    return dateString ? dateString.substring(0, dateString.lastIndexOf(":")) : undefined;
};