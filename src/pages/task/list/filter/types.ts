/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Dayjs} from "dayjs";
export interface TaskFilterFormData {
    name?: string;
    process?: string;
    priority?: "low" | "normal" | "high";
    dueDate: "overdue" | "noDueDate" | "today" | "period";
    dueDatePeriod: Dayjs[];
    createDatePeriod: Dayjs[];
}