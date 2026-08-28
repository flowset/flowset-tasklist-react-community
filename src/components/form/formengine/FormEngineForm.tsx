/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useMemo, useRef} from "react";
import {FormViewer, type ActionEventArgs, type IFormViewer} from "@react-form-builder/core";
import {viewWithCss} from "@react-form-builder/components-rsuite";
import {Typography} from "antd";
import type {InitialData, ProcessFormData} from "@models/form.ts";
import type {
    FormErrors,
    FormFieldValues,
    FormViewerHandle,
    SubmitEventData,
    SubmitEventResult
} from "./types/FormViewerHandle.ts";
import "./FormEngineForm.css";

const {Text} = Typography;

export interface FormEngineFormProps {
    form?: ProcessFormData | null;
    initialData?: InitialData;
    onSubmit?: (submitResult: SubmitEventData) => void;
    readOnly?: boolean;
    onImportError?: (reason: unknown) => void;
}

function toFormErrors(errors: Record<string, unknown>): FormErrors {
    const result: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(errors)) {
        if (Array.isArray(value)) {
            result[key] = value.map(String);
        } else if (value != null && value !== "") {
            result[key] = [String(value)];
        }
    }
    return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Renders a FormEngine form deployed to the BPM engine (same RSuite kit as Workspace).
 */
export const FormEngineForm = forwardRef<FormViewerHandle, FormEngineFormProps & Omit<HTMLAttributes<HTMLDivElement>, "id" | "ref" | "onSubmit">>(({
                                                                                                                                                       form,
                                                                                                                                                       initialData,
                                                                                                                                                       readOnly,
                                                                                                                                                       onSubmit,
                                                                                                                                                       onImportError,
                                                                                                                                                       ...divProps
                                                                                                                                                   }, ref) => {
    const viewerRef = useRef<IFormViewer | null>(null);
    const importError = form?.content ? undefined : "Form schema is empty";

    const getForm = useCallback(() => {
        try {
            return form?.content ?? "";
        } catch (error) {
            onImportError?.(error);
            return "";
        }
    }, [form?.content, onImportError]);

    const actions = useMemo(() => ({
        submitForm: (e: ActionEventArgs) => {
            const formData = e.store.formData;
            onSubmit?.({
                data: {...e.data} as FormFieldValues,
                errors: formData.hasErrors ? toFormErrors(formData.errors as Record<string, unknown>) : undefined,
            });
        },
    }), [onSubmit]);

    useImperativeHandle(ref, () => ({
        getFormFieldValues(): FormFieldValues {
            return {...(viewerRef.current?.formData.data ?? {})};
        },
        getFieldValue(key: string): unknown {
            return viewerRef.current?.formData.data[key];
        },
        reset() {
            viewerRef.current?.formData.reset(false);
        },
        setEnabled(enabled: boolean) {
            void enabled;
        },
        setFieldValue(key: string, value: unknown) {
            const data = viewerRef.current?.formData.data;
            if (data) {
                data[key] = value;
            }
        },
        setReadOnly(_readOnly: boolean) {
            void _readOnly;
        },
        submit(): SubmitEventResult {
            const formData = viewerRef.current?.formData;
            if (!formData) {
                return undefined;
            }
            void formData.validate().then(() => {
                onSubmit?.({
                    data: {...formData.data},
                    errors: formData.hasErrors ? toFormErrors(formData.errors as Record<string, unknown>) : undefined,
                });
            });
            return {
                data: {...formData.data},
                errors: formData.hasErrors ? toFormErrors(formData.errors as Record<string, unknown>) : undefined,
            };
        },
        validate(): FormErrors {
            const formData = viewerRef.current?.formData;
            if (!formData) {
                return undefined;
            }
            void formData.validate();
            return formData.hasErrors ? toFormErrors(formData.errors as Record<string, unknown>) : undefined;
        },
        setErrors(errors: FormErrors) {
            if (viewerRef.current && errors) {
                viewerRef.current.formData.errors = errors;
            }
        },
        removeFieldError(id: string) {
            const formData = viewerRef.current?.formData;
            if (!formData) {
                return;
            }
            const next = {...formData.errors};
            delete next[id];
            formData.errors = next;
        },
    }), [onSubmit]);

    if (importError) {
        return <Text type="danger">{importError}</Text>;
    }

    return (
        <div id="formengine-form-container" {...divProps}>
            <FormViewer
                view={viewWithCss}
                getForm={getForm}
                actions={actions}
                initialData={initialData as Record<string, unknown> | undefined}
                readOnly={readOnly}
                viewerRef={viewerRef}
            />
        </div>
    );
});
