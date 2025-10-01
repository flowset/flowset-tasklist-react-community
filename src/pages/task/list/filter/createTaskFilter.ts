/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import dayjs from "dayjs";
import type {TaskFilterFormData} from "./types.ts";
import type {TaskFilterPayload} from "@models/user-task.ts";
import {formatOffsetDateTime} from "@utils/format";
import {getEndOfDay, getStartOfDay} from "@utils/date-time";

const minPriorities: Record<string, number> = {
    "low": 0,
    "normal": 40,
    "high": 60
};

const maxPriorities: Record<string, number> = {
    "low": 39,
    "normal": 59,
};

export const createTaskFilter = (formData: TaskFilterFormData) => {
    const filterData: TaskFilterPayload = {};

    if (formData.name && formData.name.length > 0) {
        filterData.nameLike = formData.name;
    }
    if (formData.process && formData.process.length > 0) {
        filterData.processDefinitionNameLike = formData.process;
    }

    if (formData.priority) {
        filterData.minPriority = minPriorities[formData.priority];
        filterData.maxPriority = maxPriorities[formData.priority];
    }

    switch (formData.dueDate) {
        case "overdue":
            filterData.dueDateBefore = formatOffsetDateTime(dayjs());
            break;

        case "today":
            filterData.dueDateAfter = formatOffsetDateTime(getStartOfDay(dayjs()));
            filterData.dueDateBefore = formatOffsetDateTime(getEndOfDay(dayjs()));
            break;

        case "period":
            if (formData.dueDatePeriod?.length === 2) {
                filterData.dueDateAfter = formatOffsetDateTime(getStartOfDay(formData.dueDatePeriod[0]));
                filterData.dueDateBefore = formatOffsetDateTime(getEndOfDay(formData.dueDatePeriod[1]));
            }
            break;

        case "noDueDate":
            filterData.withoutDueDate = true;
            break;
    }

    if (formData.createDatePeriod && formData.createDatePeriod.length === 2) {
        filterData.createDateAfter = formatOffsetDateTime(getStartOfDay(formData.createDatePeriod[0]));
        filterData.createDateBefore = formatOffsetDateTime(getEndOfDay(formData.createDatePeriod[1]));
    }

    const hasAnyValue = Object.keys(filterData).find(value => (filterData as Record<string, unknown>)[value] !== undefined);

    if (!hasAnyValue) {
        return undefined;
    }
    return filterData;
};