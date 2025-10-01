/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useQuery, type UseQueryOptions, type UseQueryResult} from "@tanstack/react-query";
import {useTasklistClient} from "../useTasklistClient.ts";
import {useMemo} from "react";
import type {PaginationPayload, SortPayload} from "@models/common.ts";
import type { GetProcessListResult } from "@features/tasklist-client/types/response.ts";
import type { GetProcessListParams } from "@features/tasklist-client/types/request.ts";
import type {ProcessFilterPayload} from "@models/process.ts";

export type UseGetProcessesQueryOptions = Omit<UseQueryOptions<GetProcessListResult, Error, GetProcessListResult>, "queryKey" | "queryFn">;
export type UseGetProcessesProps = Partial<GetProcessListParams>  & {
    firstPageNumber?: 0 | 1
}

export type UseGetProcessesResult = UseQueryResult<GetProcessListResult> & {
    pageInfo?: {
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
        totalPages?: number;
    };
};

const defaultFilter: ProcessFilterPayload = {};
const defaultPagination: PaginationPayload = {
    page: 0,
    size: 6,
};

const defaultSort: SortPayload = {
    property: "name",
    order: "asc",
};

const defaultFirstPageNumber = 1;

/**
 * Hook to load a list of process definitions that can be started from the TaskList.
 * This hook uses the <code>useQuery</code> hook from the "react-query" library.
 * @param requestParams request params
 * @param queryOptions "react-query" query options
 */
export const useGetProcesses = (requestParams: UseGetProcessesProps = {}, queryOptions?: UseGetProcessesQueryOptions): UseGetProcessesResult => {
    const {
        filter = defaultFilter,
        pagination = defaultPagination,
        sort = defaultSort,
        firstPageNumber = defaultFirstPageNumber
    } = requestParams;

    const taskListClient = useTasklistClient();

    const resultPagination: PaginationPayload = {
        ...pagination,
        page: Number(pagination.page) - firstPageNumber
    };

    const resultParams = {...requestParams, pagination: resultPagination};

    const result = useQuery<GetProcessListResult, Error, GetProcessListResult>({
        queryKey: ["getProcesses", filter, pagination, sort],
        queryFn: () => taskListClient.getProcesses(resultParams),
        ...queryOptions,
    });

    return useMemo(
        () =>
            result.data
                ? {
                    ...result,
                    pageInfo: {
                        hasNextPage: (firstPageNumber === 0 ? Number(pagination.page) + 1 : Number(pagination.page)) * Number(pagination.size) < result.data.totalElements,
                        hasPreviousPage: Number(pagination.page) > firstPageNumber,
                        totalPages: Math.ceil(result.data.totalElements / Number(pagination.size))
                    },
                }
                : result,
        [firstPageNumber, pagination.page, pagination.size, result]
    ) as UseQueryResult<GetProcessListResult> & {
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
            totalPages?: number;
        };
    };
};