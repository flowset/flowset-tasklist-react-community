/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useSearchParams} from "react-router-dom";

export interface UseQueryParamProps {
    /**
     * The name of the query parameter to manage
     */
    paramName: string;
}

export interface UseQueryParamResult {
    /**
     * Current value of the query parameter, or null if not present
     */
    value: string | null;
    /**
     * Sets the value of the query parameter
     * @param value new value to set for the parameter
     */
    setValue: (value?: string | null) => void;
    /**
     * Removes the query parameter from the URL
     */
    removeValue: () => void;

    hasValue: () => boolean;
}

/**
 * Hook for managing a single query parameter in the URL.
 * Provides methods to get, set, and remove a specific query parameter.
 *
 * @param props props containing the parameter name
 */
export const useQueryParam = (props: UseQueryParamProps): UseQueryParamResult => {
    const {paramName} = props;

    const [searchParams, setSearchParams] = useSearchParams();

    const setValue = (value?: string | null) => {
        if (!value) {
            searchParams.delete(paramName);
        } else {
            searchParams.set(paramName, value);
        }
        setSearchParams(searchParams);

    };

    const removeValue = () => {
        searchParams.delete(paramName);
        setSearchParams(searchParams);
    };

    return {
        value: searchParams.get(paramName),
        setValue,
        removeValue,
        hasValue: () => searchParams.has(paramName)
    }
};