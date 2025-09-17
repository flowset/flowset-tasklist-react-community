/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import dayjs from "dayjs";
import i18n from '../../features/i18n/config';

export const renderDateTime = (value?: string | null, nullValueString? :string) => {
    const dateTimeFormat = i18n.t('common:dateTimeFormat');
    return value ? dayjs(value).format(dateTimeFormat) : nullValueString;
}