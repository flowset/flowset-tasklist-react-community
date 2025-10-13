/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import { LocalizedValidator } from "./LocalizedValidator.ts";
import {ExpressionLanguageModule} from "@bpmn-io/form-js-viewer";

export default {
    __init__: ["validator"],
    __depends__: [
        ExpressionLanguageModule,
    ],
    validator: ["type", LocalizedValidator],
};