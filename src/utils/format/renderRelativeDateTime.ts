/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import dayjs, {Dayjs} from "dayjs";
import duration from "dayjs/plugin/duration";
import i18n from "@features/i18n/config";

dayjs.extend(duration);

export const renderRelativeDateTime = (date1?: string | number, date2?: string | number) => {
    if (!date1 || !date2) {
        return "Invalid date";
    }

    const value1 = dayjs(date1);
    const value2 = dayjs(date2);

    return getDateTimeDiff(value1, value2);
};

const getDateTimeDiff = (date1: Dayjs, date2: Dayjs) => {
    const diff = dayjs.duration(date1.diff(date2));
    const days = diff.days();
    const hours = diff.hours();
    const minutes = diff.minutes();
    const seconds = diff.seconds();

    if (days > 0) {
        return i18n.t("common:relativeDate.days", {count: days});
    }
    if (hours > 0) {
        return i18n.t("common:relativeDate.hours", {count: hours});
    }

    if (minutes > 0) {
        return i18n.t("common:relativeDate.min", {count: minutes});
    }

    if (seconds > 0) {
        return i18n.t("common:relativeDate.sec", {count: seconds});
    }

    if (days === 0 && hours === 0 && minutes === 0 && hours === 0) {
        return undefined;
    }
};