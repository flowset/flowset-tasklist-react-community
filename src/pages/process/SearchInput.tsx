/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCallback, useEffect, useState} from "react";
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useQueryParam} from "../../hooks/query-params/useQueryParam.ts";

interface SearchInputProps {
    onSearch: (searchString?: string | null) => void
}

/**
 * An input field to enter a search criteria to find processes on {@link ProcessListPage}.
 * @param onSearch handler for process search
 * @constructor
 */
export const SearchInput = ({onSearch}: SearchInputProps,) => {
    const {t: translate} = useTranslation(["process"]);
    const {value, setValue, hasValue, removeValue} = useQueryParam({
        paramName: "q"
    });

    const [searchTerm, setSearchTerm] = useState<undefined | string | null>(value);

    useEffect(() => {
        if (searchTerm) {
            setValue(searchTerm);
        } else {
            if (hasValue()) {
                removeValue();
            }
        }

        if (!searchTerm || searchTerm.length === 0) {
            onSearch(searchTerm);
        } else {
            const delayDebounceFn = setTimeout(() => {
                onSearch(searchTerm);
            }, 800);

            return () => clearTimeout(delayDebounceFn);
        }

    }, [searchTerm, onSearch]);

    const onSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    return (
        <>
            <Input placeholder={translate("listPage.search.placeholder")}
                   allowClear={true}
                   onChange={onSearchInputChange}
                   value={searchTerm ? searchTerm : ""}
                   prefix={<SearchOutlined/>}
            />
        </>
    );
};