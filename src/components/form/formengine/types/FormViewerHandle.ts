/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

export type FormFieldValues = Record<string, unknown>;
export type FormErrors = Record<string, string[]> | undefined;
export type SubmitEventResult<FormData = FormFieldValues> = SubmitEventData<FormData> | undefined;

export interface SubmitEventData<FormData = FormFieldValues> {
    data: FormData;
    errors: FormErrors;
}

/**
 * Imperative handle for the deployed FormEngine viewer (task and start forms).
 */
export interface FormViewerHandle<FormData = FormFieldValues> {
    getFormFieldValues(): FormData;

    validate(): FormErrors;

    submit(): SubmitEventResult<FormData>;

    reset(): void;

    setErrors(errors: FormErrors): void;

    removeFieldError(id: string): void;

    setReadOnly(readOnly: boolean): void;

    setEnabled(enabled: boolean): void;

    getFieldValue(key: string): unknown;

    setFieldValue(key: string, value: unknown): void;
}
