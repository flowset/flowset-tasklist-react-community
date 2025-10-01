/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Dayjs} from "dayjs";

/**
 * Values to filter process instances started by the current user
 */
export interface InstanceFilterFormData {
    processName?: string;
    businessKey?: string;
    startTimePeriod: Dayjs[];
}