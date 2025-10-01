/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import dayjs from "dayjs";
import i18n from "@features/i18n/config.ts";

export const renderDayMonth = (value?: string | null, nullValueString? :string) => {
    const dateFormat = i18n.t("common:dayMonthFormat");
    return value ? dayjs(value).format(dateFormat) : nullValueString;
};