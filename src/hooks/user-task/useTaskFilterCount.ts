/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCallback} from "react";
import type {TaskFilterFormData} from "@pages/task/list/filter/types.ts";

export const useTaskFilterCount = (filterValues?: TaskFilterFormData) => {
    return useCallback(() => {
        if (!filterValues) {
            return undefined;
        }
        const {name, process, dueDate, createDatePeriod, dueDatePeriod, priority} = filterValues;
        let count = 0;
        if (name && name.length > 0) count++;
        if (process && process.length > 0) count++;
        if (dueDate && (filterValues.dueDate !== "period" || dueDatePeriod?.length > 0)) count++;
        if (createDatePeriod && createDatePeriod.length > 0) count++;
        if (priority) count++;

        return count;
    }, [filterValues]);
};