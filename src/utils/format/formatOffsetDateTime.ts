/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {Dayjs} from "dayjs";

export const formatOffsetDateTime = (date: Dayjs): string => {
    return date.format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
};