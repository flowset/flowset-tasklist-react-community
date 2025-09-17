/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {InitialData, ProcessFormData} from "../../../types/common.ts";
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

    if (!formData) {
        return {};
    }

    const schema = formData?.content ? JSON.parse(formData.content) as FormJsFormSchema : undefined;
    const key = formData?.formKey;
    const data = initialData as InitialData;

    return {schema, initialData: data, key, version: formData?.version}
}