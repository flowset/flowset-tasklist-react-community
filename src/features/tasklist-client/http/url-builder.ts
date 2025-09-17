/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Builds a URL with custom query parameters from a key-value object
 * @param baseUrl - base URL without query parameters
 * @param customParams - key-value pairs to be added as query parameters
 * @returns result URL with query parameters
 */
export const buildUrlWithParams = (baseUrl: string, customParams?: Record<string, string>): string => {
    const searchParams = new URLSearchParams();

    if (customParams) {
        Object.entries(customParams).forEach(([key, value]) => {
            searchParams.set(key, value);
        });
    }

    return buildUrlWithSearchParameters(baseUrl, searchParams);
}

/**
 * Builds a URL with existing URLSearchParams object
 * @param baseUrl - The base URL without query parameters
 * @param searchParams - Optional URLSearchParams object containing query parameters
 * @returns result URL with query parameters
 */
export const buildUrlWithSearchParameters = (baseUrl: string, searchParams?: URLSearchParams): string => {
    const urlParamsStr = searchParams && searchParams.size > 0 ? `?${searchParams.toString()}` : "";

    return baseUrl + urlParamsStr;
}