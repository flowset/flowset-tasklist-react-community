/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

export type AutocompleteResponse = {
    colors: string[];
};

export type UsernameCheckResponse = {
    username: string;
    exists: boolean;
    available: boolean;
};

/**
 * Fetches autocomplete suggestions from a configurable REST endpoint.
 * Expects JSON `{ colors: string[] }` and sends the search text as `q`.
 */
export async function fetchAutocompleteOptions(
    url: string,
    query: string,
): Promise<string[]> {
    const endpoint = new URL(url, window.location.origin);
    if (query.trim()) {
        endpoint.searchParams.set("q", query.trim());
    }
    const response = await fetch(endpoint.toString());
    if (!response.ok) {
        throw new Error(`Failed to load options (${response.status})`);
    }
    const data = (await response.json()) as AutocompleteResponse;
    return data.colors;
}

/** Checks whether a username already exists via the mock REST endpoint. */
export async function checkUsernameAvailable(username: string): Promise<boolean> {
    const params = new URLSearchParams({username});
    const response = await fetch(`/api/username/check?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Failed to check username (${response.status})`);
    }
    const data = (await response.json()) as UsernameCheckResponse;
    return data.available;
}
