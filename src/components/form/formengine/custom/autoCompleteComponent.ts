/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {boolean, define, string} from "@react-form-builder/core";
import {AutoComplete} from "./AutoComplete.tsx";

export const autoComplete = define(AutoComplete, "AutoComplete")
    .props({
        value: string.valued,
        label: string,
        placeholder: string.default("Start typing…"),
        disabled: boolean.default(false),
        url: string,
    })
    .build();
