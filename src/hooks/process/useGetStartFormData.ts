/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useQuery, type UseQueryOptions, type UseQueryResult} from "@tanstack/react-query";
import {useTasklistClient} from "../useTasklistClient.ts";
import type {GetStartFormResult, GetTaskFormResult} from "@features/tasklist-client/types/response.ts";
import type {GetStartFormDataParams} from "@features/tasklist-client/types/request.ts";


export type UseGetStartFormDataQueryOptions = Omit<UseQueryOptions<GetStartFormResult, Error, GetStartFormResult>, "queryKey" | "queryFn">;
export type UseGetStartFormDataResult = UseQueryResult<GetStartFormResult>;

/**
 * Hook to load start form data.
 * This hook uses the <code>useQuery</code> hook from the "react-query" library.
 * @param requestParams request params that will be sent to the backend
 * @param queryOptions "react-query" query options
 */
export const useGetStartFormData = (requestParams: GetStartFormDataParams, queryOptions: UseGetStartFormDataQueryOptions = {}): UseGetStartFormDataResult => {
    const {processDefinitionId} = requestParams;
    const taskListClient = useTasklistClient();


    const query: UseQueryResult<GetTaskFormResult> = useQuery<GetStartFormResult, Error, GetStartFormResult>({
        queryKey: ["getStartFormData", {id: String(processDefinitionId)}],
        queryFn: () => taskListClient.getStartFormData(requestParams),
        ...queryOptions
    });
    return query as UseGetStartFormDataResult;
};