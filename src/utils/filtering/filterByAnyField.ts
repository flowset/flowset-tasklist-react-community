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
export const filterByAnyField = <T = Record<string, any>>(array: T[], properties: string[], searchString?: string) => {
    if (!searchString) {
        return array;
    }


    return array.filter((item) => {
        const hasProperty = properties.some((property) => {
            const itemProperty = (item as any)[property];
            if (typeof itemProperty === 'string') {
                return itemProperty.toLowerCase().includes(searchString.toLowerCase());
            }
            return false;
        });


        return hasProperty;
    });
};

