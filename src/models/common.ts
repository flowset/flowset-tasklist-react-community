/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Pagination settings used on the Flowset Tasklist pages.
 */
export interface PaginationPayload {
    page: number;
    size: number;
}

/**
 * Sort options used on the Flowset Tasklist pages.
 */
export interface SortPayload {
    property: string;
    order: SortOrder | string;
}

export enum SortOrder {
    Asc = "asc",
    Desc = "desc"
}