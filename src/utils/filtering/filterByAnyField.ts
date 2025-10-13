/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Sorts an array of objects by specified property and direction.
 * @param array an array of objects to sort
 * @param properties
 * @param searchString
 */
export const filterByAnyField = <T = Record<string, unknown>>(array: T[],   properties: Array<keyof T>, searchString?: string) => {
    if (!searchString) {
        return array;
    }

    const lowerSearch = searchString.toLowerCase();

    return array.filter((item) => {
        return properties.some((property) => {
            const itemProperty = item[property];
            if (typeof itemProperty === "string") {
                return itemProperty.toLowerCase().includes(lowerSearch);
            }
            return false;
        });
    });
};

