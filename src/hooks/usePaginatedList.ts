/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useSort, type UseSortResult, type UseSortProps} from "./useSort.ts";
import {usePagination, type UsePaginationHookValue, type UsePaginationProps} from "./usePagination.ts";

export type UsePaginatedListProps = UsePaginationProps & UseSortProps;
export type UsePaginatedListResult = UsePaginationHookValue & UseSortResult;

export const usePaginatedList = (props: UsePaginatedListProps): UsePaginatedListResult => {
    const sort = useSort({
        defaultSort: props.defaultSort
    });

    const pagination = usePagination({
        defaultPagination: props.defaultPagination
    });

    return {
        ...sort,
        ...pagination,
    }
}