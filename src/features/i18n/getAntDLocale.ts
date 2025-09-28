/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import ru_Ru from "antd/locale/ru_RU";
import en_US from "antd/locale/en_US";
import es_ES from "antd/locale/es_ES";
import de_DE from "antd/locale/de_DE";

/**
 * Evaluates a locale for Ant Design components based of the provided string containing an application locale.
 * More information about supported languages: https://ant.design/docs/react/i18n?s=spin
 * @param locale application locale
 */
export const getAntDLocale = (locale?: string) => {
    if (!locale || locale === "en") {
        return en_US;
    }
    if (locale === "ru") {
        return ru_Ru;
    }

    if (locale === "es") {
        return es_ES;
    }

    if (locale === "de") {
        return de_DE;
    }

    return en_US;
}