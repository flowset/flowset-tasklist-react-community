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
 * Provides methods to interact with the displayed FormJs form.
 */
export interface FormJsFormViewer<FormData = FormFieldValues> {
    /**
     * Returns form field values.
     */
    getFormFieldValues(): FormData;

    /**
     * Validates the form field values, displays and returns validation errors
     */
    validate(): FormErrors;

    /**
     * Submits the form: validates the form and invokes the submit handler.
     */
    submit(): SubmitEventResult<FormData>;

    /**
     * Resets the form field values to initial values.
     */
    reset(): void;

    /**
     * Sets field validation errors that should be displayed in the form
     * @param errors field validation errors
     */
    setErrors(errors: FormErrors): void;

    /**
     * Remove a validation error for the field with the specified id.
     * @param id form field id
     */
    removeFieldError(id: string): void;

    /**
     * Makes a form as read-only or not.
     * @param readOnly a flag that indicates whether a form should be read-only
     */
    setReadOnly(readOnly: boolean): void;

    /**
     * Makes a form as enabled or not.
     * @param enabled a flag that indicates whether a form should be enabled
     */
    setEnabled(enabled: boolean): void;

    /**
     * Returns the value of the field with the specified key.
     * @param key form field key
     */
    getFieldValue(key: string): unknown;

    /**
     * Set the value in the field with the specified key.
     * @param key form field key
     * @param value form field value
     */
    setFieldValue(key: string, value: unknown): void;
}
