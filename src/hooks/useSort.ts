/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {SORT_BY_URL_PARAM_NAME, SORT_ORDER_URL_PARAM_NAME} from "../utils/query-params/constants.ts";
import {useState} from "react";
import {useQueryParams} from "./query-params/useQueryParams.ts";
import type { SortPayload } from "../types/common.ts";

/**
 * Configuration props for the useSort hook
 */
export interface UseSortProps {
    /**
     * Default sort configuration to use when no sort parameters are present in URL
     */
    defaultSort: SortPayload;
}

/**
 * Return value from the useSort hook containing sort state and manipulation methods
 */
export interface UseSortResult {
    /**
     * Current sort field name
     */
    currentSortBy?: string;
    /**
     * Current sort order (asc/desc)
     */
    currentSortOrder?: string;
    /**
     * Sets new sort configuration
     * @param sort new sort payload or undefined to clear sorting
     */
    setSortData: (sort?: SortPayload) => void;
    /**
     * Current sort data
     */
    currentSortData: SortPayload | undefined;

}

/**
 * Hook for managing sort parameters in URL query string
 * Synchronizes sort state between URL parameters and component state
 *
 * @param props - props including default sort values
 * @returns Object containing current sort state and manipulation methods
 */
export const useSort = (props?: UseSortProps): UseSortResult => {
    const {
        values: sortPayloadParam, removeAllValues: removeSortParams,
        setValues: setSortParams
    } = useQueryParams({
        paramNames: [SORT_BY_URL_PARAM_NAME, SORT_ORDER_URL_PARAM_NAME]
    });


    const getSortPayloadFromParams = (): SortPayload | undefined => {
        const containsEmptyValue = Object.values(sortPayloadParam).some(value => !value);
        if (containsEmptyValue) {
            return undefined;
        }
        return {
            order: sortPayloadParam[SORT_ORDER_URL_PARAM_NAME]!!,
            property: sortPayloadParam[SORT_BY_URL_PARAM_NAME]!!,
        };
    }

    const [sortData, setSortData] = useState<SortPayload | undefined>(getSortPayloadFromParams() || props?.defaultSort);

    const onSetSortData = (newSort?: SortPayload) => {
        if (!newSort) {
            removeSortParams();
            setSortData(undefined);
            return;
        }

        const newSortField = newSort.property;
        const newSortOrder = newSort.order;

        const sortDirectionChanged = sortData?.order && sortData.order !== newSortOrder;
        const sortFieldChanged = sortData?.property && sortData.property !== newSortField;
        if (sortDirectionChanged || sortFieldChanged) {
            setSortParams({
                [SORT_ORDER_URL_PARAM_NAME]: newSortOrder,
                [SORT_BY_URL_PARAM_NAME]: newSortField,
            });
            setSortData({
                property: newSortField,
                order: newSortOrder,
            });
        }
    };

    return {
        currentSortBy: sortData?.property,
        currentSortOrder: sortData?.order,
        setSortData: onSetSortData,
        currentSortData: sortData,
    }
}