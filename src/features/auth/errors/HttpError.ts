/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * HTTP error containing status code and text.
 */
export class HttpError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        message?: string
    ) {
        super(message || `HttpError: ${status} ${statusText}`);
        this.name = "HttpError";
    }
}