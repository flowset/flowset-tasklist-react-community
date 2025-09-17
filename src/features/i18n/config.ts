/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import i18n from "i18next";

import {initReactI18next} from "react-i18next";
import {en} from "./messages/en.ts";
import {ru} from "./messages/ru.ts";
import "intl-pluralrules";
import {de} from "./messages/de.ts";
import {es} from "./messages/es.ts";
import {getEnv} from "../../utils/env/env.ts";

const APP_LOCALE = getEnv("VITE_APP_LOCALE", "en");

/**
 * Initializes i18next internationalization library
 * For all configuration options see: https://www.i18next.com/overview/configuration-options
 */
i18n
    .use(initReactI18next)
    .init({
        fallbackLng: APP_LOCALE,
        resources: {
            en,
            de,
            es,
            ru
        }
    });

export default i18n;