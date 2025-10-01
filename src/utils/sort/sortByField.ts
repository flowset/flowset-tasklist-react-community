/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {SortPayload} from "@models/common.ts";

/**
 * Sorts an array of objects by specified property and direction.
 * @param array an array of objects to sort
 * @param sort sort data containing property and direction (asc, desc)
 */
export const sortByField = <T>(array: T[], sort?: SortPayload) => {
    if (!sort || !sort.property || !sort.order) {
        return array;
    }

    const ascending = sort.order === "asc";
    const field = sort.property as keyof T;

    return [...array].sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];

        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return ascending ? -1 : 1;
        if (valueB == null) return ascending ? 1 : -1;

        if (typeof valueA === "number" && typeof valueB === "number") {
            return ascending ? valueA - valueB : valueB - valueA;
        }

        const strA = String(valueA).toLowerCase();
        const strB = String(valueB).toLowerCase();

        return ascending ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
};

