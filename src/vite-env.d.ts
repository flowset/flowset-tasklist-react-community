/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/// <reference types="vite/client" />

interface Window {
    env?: {
        [key: string]: string | undefined;
    };
}