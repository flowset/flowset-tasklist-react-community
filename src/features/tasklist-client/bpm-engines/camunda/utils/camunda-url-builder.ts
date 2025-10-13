/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {PaginationPayload, SortPayload} from "@models/common.ts";
import {buildUrlWithSearchParameters} from "@features/tasklist-client/http/url-builder.ts";

/**
 * Builds a URL with pagination, sorting, and custom query parameters using Camunda-specific parameter names.
 * @param baseUrl - base URL or URI without query parameters
 * @param pagination - pagination settings (page and size)
 * @param sort - sorting options (property and order)
 * @param customParams - additional key-value query parameters
 * @returns result URL with all specified query parameters
 */
export const buildUrl = (baseUrl: string, pagination?: PaginationPayload, sort?: SortPayload, customParams?: Record<string, string>): string => {
    const searchParams = new URLSearchParams();

    addPaginationQueryParam(searchParams, pagination);
    addSortQueryParam(searchParams, sort?.property, sort?.order);

    if (customParams) {
        Object.entries(customParams).forEach(([key, value]) => {
            searchParams.set(key, value);
        });
    }

    return buildUrlWithSearchParameters(baseUrl, searchParams);
};

const addPaginationQueryParam = (searchParams: URLSearchParams, pagination?: PaginationPayload) => {
    if (pagination) {
        const firstResult = pagination.page * pagination.size;
        searchParams.set("firstResult", String(firstResult));
        searchParams.set("maxResults", String(pagination.size));
    }
};

const addSortQueryParam = (searchParams: URLSearchParams, sortBy?: string, sortOrder?: string) => {
    if (sortBy) {
        searchParams.set("sortBy", sortBy);
    }
    if (sortOrder) {
        searchParams.set("sortOrder", sortOrder);
    }
};



