/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {FormType, type ProcessFormData} from "@models/form.ts";
import {getEnv} from "@utils/env";
import formengineSchema from "./fixtures/formengine.form.json";

/**
 * When true, skips BPM REST calls that load form schema
 * (`/task/{id}/form` + `/deployed-form`, `/startForm` + `/deployed-start-form`),
 * returns the FormEngine stub fixture, and renders FormEngine instead of form-js.
 *
 * Controlled by `VITE_USE_DEPLOYED_FORM_STUB` (`true` / `1` / `yes`).
 */
export const USE_DEPLOYED_FORM_STUB = ["true", "1", "yes"].includes(
    getEnv("VITE_USE_DEPLOYED_FORM_STUB", "false").trim().toLowerCase(),
);

const STUB_FORM_KEY = "stub:formengine";

/**
 * Full ProcessFormData stub used when bypassing both form metadata and deployed-form APIs.
 */
export const createTaskFormDataStub = (): ProcessFormData => {
    return {
        formKey: STUB_FORM_KEY,
        type: FormType.FORM_JS_JSON,
        content: JSON.stringify(formengineSchema),
    };
};

/**
 * Builds a ProcessFormData payload with stubbed FormEngine schema content.
 * Preserves formKey/version from the `/form` metadata response when present.
 */
export const createDeployedFormStub = (defaultForm: ProcessFormData): ProcessFormData => {
    return {
        ...defaultForm,
        formKey: defaultForm.formKey ?? STUB_FORM_KEY,
        type: FormType.FORM_JS_JSON,
        content: JSON.stringify(formengineSchema),
    };
};
