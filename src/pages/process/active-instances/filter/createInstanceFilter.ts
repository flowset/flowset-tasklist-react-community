/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {InstanceFilterFormData} from "./types.ts";
import type {ProcessInstanceFilterPayload} from "@models/process.ts";
import {formatOffsetDateTime} from "@utils/format";
import {getEndOfDay, getStartOfDay} from "@utils/date-time";

export const createInstanceFilter = (formData: InstanceFilterFormData) => {
    const filterData: ProcessInstanceFilterPayload = {};

    if (formData.processName && formData.processName.length > 0) {
        filterData.processDefinitionNameLike = formData.processName;
    }

    if (formData.businessKey && formData.businessKey.length > 0) {
        filterData.businessKeyLike = formData.businessKey;
    }

    if (formData.startTimePeriod && formData.startTimePeriod.length === 2) {
        filterData.startedAfter = formatOffsetDateTime(getStartOfDay(formData.startTimePeriod[0]));
        filterData.startedBefore = formatOffsetDateTime(getEndOfDay(formData.startTimePeriod[1]));
    }

    const hasAnyValue = Object.keys(filterData).find(value => (filterData as Record<string, unknown>)[value] !== undefined);
    if (!hasAnyValue) {
        return undefined;
    }
    return filterData;
};