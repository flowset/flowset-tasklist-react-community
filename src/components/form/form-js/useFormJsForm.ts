/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useMemo} from "react";
import type {InitialData, ProcessFormData} from "@models/form.ts";
import type {FormJsFormSchema} from "./types/components.ts";



export interface UseFormJsFormOptions {
    formData?: ProcessFormData | null;
    initialData?: InitialData;
}

export interface TaskFormQueryResult<InitialData = FormData> {
    schema?: FormJsFormSchema
    initialData?: InitialData
    key?: string
    version?: number
}

export interface FormData {
    [x: string]: unknown;
}

/**
 * Hook to get a form schema as JSON object instead of a string and initial data as a typed object (optionally).
 * @param options options containing source form data
 */
export const useFormJsForm = <InitialData = FormData>(options: UseFormJsFormOptions): TaskFormQueryResult<InitialData> => {
    const {formData, initialData} = options;

    // Parse once per form content: FormJsForm re-imports the schema whenever this object changes, and a new
    // object on every render would reset the form (and what the user typed) on any parent re-render.
    const content = formData?.content;
    const schema = useMemo(() => content ? JSON.parse(content) as FormJsFormSchema : undefined, [content]);

    if (!formData) {
        return {};
    }

    const key = formData?.formKey;
    const data = initialData as InitialData;

    return {schema, initialData: data, key, version: formData?.version}
};