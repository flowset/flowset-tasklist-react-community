/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {PAGE_SIZE_URL_PARAM_NAME, PAGE_URL_PARAM_NAME} from "../utils/query-params/constants.ts";
import {useQueryParams} from "@hooks/query-params";
import type {PaginationPayload} from "../models/common.ts";

export interface UsePaginationProps {
    defaultPagination?: PaginationPayload;
}

export interface UsePaginationHookValue {
    currentPage?: number;
    currentPageSize?: number;
    setPageNumber: (page: number) => void;
    setPageSize: (page: number) => void;
    setPageData: (page: PaginationPayload) => void;
    currentPageData?: PaginationPayload;

}

export const usePagination = (props?: UsePaginationProps): UsePaginationHookValue => {
    const {
        values: paginationParams, setValues: setPaginationParams, getValue
    } = useQueryParams({
        paramNames: ["page", PAGE_SIZE_URL_PARAM_NAME]
    });

    const getPageDataParams = (): PaginationPayload | undefined => {
        const pageParam = getValue(PAGE_URL_PARAM_NAME);
        const sizeParam = paginationParams[PAGE_SIZE_URL_PARAM_NAME];
        if (!pageParam || !sizeParam) {
            return undefined;
        }
        return {
            page: Number(pageParam),
            size: Number(sizeParam),
        };
    };

    const getPaginationData = () => {
        return getPageDataParams() || props?.defaultPagination;
    };

    const onSetPageData = (paginationPayload?: PaginationPayload) => {
        if (paginationPayload && paginationPayload.page !== undefined && paginationPayload.size !== undefined) {
            setPaginationParams({
                [PAGE_URL_PARAM_NAME]: String(paginationPayload.page),
                [PAGE_SIZE_URL_PARAM_NAME]: String(paginationPayload.size)
            });
        }
    };

    const setPageSize = (size: number) => {
        setPaginationParams({
            [PAGE_SIZE_URL_PARAM_NAME]: String(size)
        });
    };

    const setPageNumber = (page: number) => {
        setPaginationParams({
            [PAGE_URL_PARAM_NAME]: String(page)
        });
    };

    const paginationData = getPaginationData();
    return {
        currentPage: paginationData?.page,
        currentPageSize: paginationData?.size,
        setPageNumber,
        setPageSize,
        setPageData: onSetPageData,
        currentPageData: paginationData,
    }
};