/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {RequestHeaders} from "../types/request.ts";

/**
 * Contains data about one request in case of running parallel requests
 */
export interface RequestData<R = unknown> {
    /**
     * Promise representing the HTTP request
     */
    promise: Promise<Response>;
    /**
     * Function to convert response data
     * @param data
     */
    converter?: (data: unknown) => R;
}

/**
 * Object containing parallel requests data
 */
export type RequestDataMap = Record<string, RequestData>;

/**
 * Performs a GET request and returns the raw Response object
 * @param url - request URL or URI
 * @param headers - request headers
 * @returns Promise resolving to Response object
 */
export const fetchGet = (url: string, headers?: RequestHeaders) => {
    return fetch(getEnvUrl(url), {method: "get", headers: headers})
        .then(response => handleResponse(response))
        .catch(reason => handleError(reason, url));
}

/**
 * Performs a POST request with the provided JSON data and returns the raw Response object
 * @param url - request URL or URI
 * @param data - request body
 * @param headers - request headers
 * @returns Promise resolving to Response object
 */
export const fetchPost = (url: string, data?: unknown, headers?: RequestHeaders) => {
    return fetch(getEnvUrl(url), {
        method: "post",
        headers: headers,
        body: data ? JSON.stringify(data) : undefined
    })
        .then(response => handleResponse(response))
        .catch(reason => handleError(reason, url));
}

/**
 * Performs a GET request and returns the parsed JSON response with the provided object type
 * @param url - request URL or URI
 * @param headers - request headers
 * @returns Promise resolving to parsed JSON data
 */
export const fetchGetJson = <TRESULT = unknown>(url: string, headers?: RequestHeaders) => {
    return fetch(getEnvUrl(url), {
        method: "get",
        headers: headers
    }).then(response => {
        return handleJsonResponse(response);
    }).then(result => {
        return result as TRESULT;
    }).catch(reason => handleError(reason, url));
}

/**
 * Performs a POST request with optional JSON data and returns parsed JSON response
 * @param url - request URL or URI
 * @param data - Optional data to send in the request body
 * @param headers - Request headers
 * @returns  parsed JSON data
 */
export const fetchPostJson = async <TRESULT = unknown>(url: string, data?: unknown, headers?: RequestHeaders) => {
    return fetch(getEnvUrl(url), {
        method: "post",
        headers: headers,
        body: data ? JSON.stringify(data) : undefined
    }).then(response => {
        return handleJsonResponse(response);
    }).then(result => {
        return result as TRESULT;
    }).catch(reason => handleError(reason, url));
}

/**
 * Executes multiple requests in parallel and returns results as an object
 * @param requests - Map of request data objects to execute
 * @returns Promise resolving to object with results for each request key
 */
export const fetchParallel = async <T extends RequestDataMap>(requests: T): Promise<{
    [K in keyof T]: T[K] extends RequestData<infer R>
        ? R | undefined
        : unknown;
}> => {

    const entries = Object.entries(requests) as [keyof T, RequestData][];
    const promises = entries.map(([key, {promise, converter}]) =>
        promise
            .then(response => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
            .then(data => ({
                key,
                data: converter ? converter(data) : data,
                status: 'fulfilled' as const
            }))
            .catch(error => {
                console.error(`Error while loading ${String(key)}:`, error);
                return {
                    key,
                    data: undefined,
                    status: 'rejected' as const,
                    error
                };
            })
    );

    return Promise.allSettled(promises)
        .then(results => {
            const result = {} as {
                [K in keyof T]: T[K] extends RequestData<infer R>
                    ? R | undefined
                    : unknown
            };

            results.forEach(item => {
                if (item.status === 'fulfilled') {
                    const value = item.value;
                    result[value.key] = value.data;
                }
            });

            return result;
        });
}


/**
 * Handles JSON response, checking for HTTP errors and parsing JSON
 * @param response - response object to handle
 * @returns Promise resolving to parsed JSON data
 */
const handleJsonResponse = async (response: Response) => {
    if (!response.ok) {
        console.error(`Error response: ${response.status} ${response.statusText} by URL ${response.url}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

/**
 * Handles raw response, checking for HTTP errors
 * @param response - response object to handle
 * @returns Promise resolving to the Response object if successful
 */
const handleResponse = async (response: Response): Promise<Response> => {
    if (!response.ok) {
        console.error(`Error response: ${response.status} ${response.statusText} by URL ${response.url}`);
    }
    return response;
};

/**
 * Handles request errors with logging and re-throwing
 * @param error - occurred error
 * @param url - URL that was being requested
 */
const handleError = (error: unknown, url: string): never => {
    console.error(`Error while executing request ${url}`, error);
    throw error;
};

const getEnvUrl = (url: string) => {
    if (import.meta.env.DEV) {
        return new URL(url).pathname;
    }

    return url;
}