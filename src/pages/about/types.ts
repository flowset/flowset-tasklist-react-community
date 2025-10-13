/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

export interface AboutProductMetadata {
    externalLinks: ExternalLinkData[];
    products: Product[];
}

export interface ExternalLinkData {
    url: string;
    label: string;
}

export interface Product {
    name: string;
    url: string;
    description: string;
    released: boolean;
}