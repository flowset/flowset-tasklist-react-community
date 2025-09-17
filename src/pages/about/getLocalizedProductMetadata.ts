/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {AboutProductMetadata} from "./types.ts";
import ruMetadata from "./resources/about-product-metadata-ru.json";
import deMetadata from "./resources/about-product-metadata-de.json";
import enMetadata from "./resources/about-product-metadata.json";
import esMetadata from "./resources/about-product-metadata-es.json";

export const getLocalizedProductMetadata = (locale: string): AboutProductMetadata => {
    if (locale === 'ru') {
        return ruMetadata as AboutProductMetadata;
    }

    if (locale === 'de') {
        return deMetadata as AboutProductMetadata;
    }

    if (locale === 'es') {
        return esMetadata as AboutProductMetadata;
    }
    return enMetadata as AboutProductMetadata;
}