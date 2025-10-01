/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useSearchParams} from "react-router-dom";

export interface UseQueryParamsProps {
    /**
     *  Array of query parameter names to manage
     */
    paramNames: string[];
}

export interface UseQueryParamsResult {
    /**
     * Current values of all managed query parameters
     */
    values: Record<string, string | null>;
    /**
     * Sets multiple query parameter values at once.
     * @param values new values of managed query parameters.
     */
    setValues: (values: Record<string, string>) => void;
    /**
     * Removes all managed query parameters from URL.
     */
    removeAllValues: () => void;
    /**
     * Removes specific managed query parameters from URL
     * @param paramNames query parameter names to remove
     */
    removeValues: (paramNames: string[]) => void;
    /**
     * Gets the current value of a specific query parameter.
     * @param paramName query parameter names to get value
     */
    getValue: (paramName: string) => string | null | undefined;
}

/**
 * Hook for managing query parameters in URL.
 * Provides methods to get, set, and remove query parameters with type safety.
 * Useful for maintaining state in URL for filtering, pagination, or sharing links.
 * @param props props containing names of managed query parameters.
 */
export const useQueryParams = (props: UseQueryParamsProps): UseQueryParamsResult => {
    const {paramNames} = props;

    const [searchParams, setSearchParams] = useSearchParams();

    const getValues = () => {
        const values: Record<string, string | null> = {};
        paramNames.forEach(paramName => {
            values[paramName] = searchParams.get(paramName);
        });

        return values;
    };

    const setValues = (values: Record<string, string>) => {
        Object.entries(values).forEach(([key, value]) => {
            searchParams.set(key, value);
        });
        setSearchParams(searchParams);

    };

    const removeAllValues = () => {
        paramNames.forEach((name: string) => {
            searchParams.delete(name);
        });
        setSearchParams(searchParams);
    };

    const removeValues = (paramNames: string[]) => {
        paramNames.forEach((name: string) => {
            searchParams.delete(name);
        });
        setSearchParams(searchParams);
    };

    return {
        values: getValues(),
        setValues,
        removeAllValues,
        removeValues,
        getValue: paramName => getValues()[paramName],
    }
};