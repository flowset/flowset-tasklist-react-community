/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {AutoComplete as AntAutoComplete, Typography} from "antd";
import {useCallback, useState} from "react";
import {fetchAutocompleteOptions} from "../api/client.ts";

export type AutoCompleteProps = {
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    /** REST endpoint that returns `{ colors: string[] }` (query param `q`). */
    url?: string;
};

/**
 * Form field built on Ant Design AutoComplete.
 * Suggestion URL is provided via form JSON (`url` prop).
 */
export function AutoComplete({
                                 value = "",
                                 onChange,
                                 label,
                                 placeholder = "Start typing…",
                                 disabled = false,
                                 url = "",
                             }: AutoCompleteProps) {
    const [options, setOptions] = useState<{ value: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async (text: string) => {
        if (!url) {
            setOptions([]);
            return;
        }
        setLoading(true);
        try {
            const items = await fetchAutocompleteOptions(url, text);
            setOptions(items.map((item) => ({value: item})));
        } catch {
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, [url]);

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 4}}>
            {label ? <Typography.Text>{label}</Typography.Text> : null}
            <AntAutoComplete
                value={value}
                options={options}
                onSearch={handleSearch}
                onChange={(next) => onChange?.(next)}
                placeholder={placeholder}
                disabled={disabled}
                allowClear
                style={{width: "100%"}}
                notFoundContent={loading ? "Loading…" : "No options found"}
            />
        </div>
    );
}
