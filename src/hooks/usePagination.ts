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
    currentPage: number;
    currentPageSize: number;
    setPageNumber: (page: number) => void;
    setPageSize: (page: number) => void;
    setPageData: (page: PaginationPayload) => void;
    currentPageData: PaginationPayload;

}

export const usePagination = (props?: UsePaginationProps): UsePaginationHookValue => {
    const {
        values: paginationParams, setValues: setPaginationParams
    } = useQueryParams({
        paramNames: [PAGE_URL_PARAM_NAME, PAGE_SIZE_URL_PARAM_NAME]
    });

    const getPageDataParams = (): PaginationPayload | undefined => {
        const containsEmptyValue = Object.values(paginationParams).some(value => !value);
        if (containsEmptyValue) {
            return undefined;
        }
        const pageParam = paginationParams[PAGE_URL_PARAM_NAME];
        const sizeParam = paginationParams[PAGE_SIZE_URL_PARAM_NAME];
        return {
            page: Number(pageParam),
            size: Number(sizeParam),
        };
    };

    const {page, size}: PaginationPayload = getPageDataParams() || props?.defaultPagination || {
        page: 1,
        size: 10
    };

    const setPageDataParams = (page?: number, size?: number) => {
        setPaginationParams({
            [PAGE_URL_PARAM_NAME]: String(page),
            [PAGE_SIZE_URL_PARAM_NAME]: String(size)
        });
    };

    const setPageData = (pagination: PaginationPayload) => {
        if (page !== pagination.page || size !== pagination.size) {
            setPageDataParams(pagination.page, pagination.size);
        }
    };
    const setPageSize = (size: number) => {
        setPageDataParams(page, size);
    };

    const setPageNumber = (page: number) => {
        setPageDataParams(page, size);
    };

    const getPageData = () => {
        return {
            page,
            size,
        };
    };
    return {
        currentPage: page || 1,
        currentPageSize: size || 10,
        setPageNumber,
        setPageSize,
        setPageData,
        currentPageData: getPageData(),
    }
};