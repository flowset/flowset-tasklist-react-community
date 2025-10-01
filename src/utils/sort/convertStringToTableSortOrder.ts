/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Converts a string to a string with table column sort order.
 * @param sort source string (asc or desc)
 */
export const convertStringToTableSortOrder = (sort?: string) => {
    if (!sort) {
        return undefined;
    }
    return sort === "asc" ? "ascend" : "descend";
};