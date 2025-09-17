/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {SortPayload} from "../../types/common.ts";

/**
 * Sorts an array of objects by specified property and direction.
 * @param array an array of objects to sort
 * @param sort sort data containing property and direction (asc, desc)
 */
export const sortByField = <T = Record<string, any>>(array: T[], sort?: SortPayload) => {
    if (!sort || !sort.property || !sort.order) {
        return array;
    }

    const ascending = sort.order === 'asc';
    const field = sort.property;

    return array.sort((a, b) => {
        let valueA = (a as any)[field];
        let valueB = (b as any)[field];

        if (valueA === null) valueA = undefined;
        if (valueB === null) valueB = undefined;

        if (valueA === undefined && valueB === undefined) return 0;


        if (valueA === undefined) return -1;
        if (valueB === undefined) return 1;

        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return ascending ? valueA - valueB : valueB - valueA;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return ascending
                ? valueA.toLowerCase().localeCompare(valueB.toLowerCase())
                : valueB.toLowerCase().localeCompare(valueA.toLowerCase());
        }

        return ascending
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA));
    });
};

