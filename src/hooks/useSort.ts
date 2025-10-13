/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {SORT_BY_URL_PARAM_NAME, SORT_ORDER_URL_PARAM_NAME} from "../utils/query-params/constants.ts";
import {useQueryParams} from "@hooks/query-params";
import type {SortPayload} from "../models/common.ts";

/**
 * Configuration props for the useSort hook
 */
export interface UseSortProps {
    /**
     * Default sort configuration to use when no sort parameters are present in URL
     */
    defaultSort?: SortPayload;
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
        const orderParam = sortPayloadParam[SORT_ORDER_URL_PARAM_NAME];
        const propertyParam = sortPayloadParam[SORT_BY_URL_PARAM_NAME];
        if(!orderParam || !propertyParam) {
            return undefined;
        }
        return {
            order: orderParam,
            property: propertyParam,
        };
    };

    const getSortData = () => {
        return getSortPayloadFromParams() || props?.defaultSort;
    };

    const sortData = getSortData();

    const onSetSortData = (newSort?: SortPayload) => {
        if (!newSort) {
            removeSortParams();
            return;
        }

        setSortParams({
            [SORT_ORDER_URL_PARAM_NAME]: newSort.order,
            [SORT_BY_URL_PARAM_NAME]: newSort.property,
        });
    };

    return {
        currentSortBy: sortData?.property,
        currentSortOrder: sortData?.order,
        setSortData: onSetSortData,
        currentSortData: getSortData(),
    }
};