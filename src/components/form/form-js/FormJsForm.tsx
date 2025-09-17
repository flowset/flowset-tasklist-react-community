/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {forwardRef, type HTMLAttributes, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Form} from "@bpmn-io/form-js-viewer";
import {useFormJsForm} from "./useFormJsForm.ts";
import "./FormJsForm.css";
import {Typography} from "antd";
import type {InitialData, ProcessFormData} from "../../../types/common.ts";
import type {
    FormErrors,
    FormFieldValues,
    FormJsFormViewer,
    SubmitEventData,
    SubmitEventResult
} from "./types/FormJsFormViewer.ts";
import Validator from "./validator";

const {Text} = Typography;

export interface FormJsFormProps {
    form?: ProcessFormData | null;
    initialData?: InitialData;
    onSubmit?: (submitResult: SubmitEventData) => void;
    readOnly?: boolean;
    onImportError?: (reason: unknown) => void;
}

/**
 * Component that displays a FormJs form using the provided JSON schema and initial data.
 * To interact with a displayed form outside the component, use a React reference to {@link Form} and pass it as a `ref` parameter.
 * @see Form
 * @see useGetTaskFormData
 * @see useGetUserTaskData
 */
export const FormJsForm = forwardRef<FormJsFormViewer, FormJsFormProps & Omit<HTMLAttributes<HTMLDivElement>, "id" | "ref" | "onSubmit">>(({
                                                                                                                                               form,
                                                                                                                                               initialData: formData,
                                                                                                                                               readOnly,
                                                                                                                                               onSubmit,
                                                                                                                                               onImportError,
                                                                                                                                               ...divProps
                                                                                                                                           }, ref) => {
    const formContainerRef = useRef<HTMLDivElement | null>(null);
    const formViewerRef = useRef<Form>(null);
    const {schema, initialData} = useFormJsForm({formData: form, initialData: formData});
    const [importSchemaError, setImportSchemaError] = useState<unknown>();

    useEffect(() => {
        const currentForm = (formViewerRef.current = new Form({
            container: formContainerRef.current as Element,
            properties: {
                "readOnly": readOnly
            },
            additionalModules: [
                Validator
            ]
        }));

        if (onSubmit) {
            currentForm.on("submit", (event: SubmitEventData) => {
                onSubmit(event);
            });
        }

        return () => {
            currentForm.destroy();
        }
    }, [form, onSubmit, readOnly]);

    useImperativeHandle(ref, () => {
            return {
                getFormFieldValues(): FormFieldValues {
                    const submitData = formViewerRef.current?._getSubmitData();
                    return submitData || {};
                }, getFieldValue(key: string): unknown {
                    const submitData = formViewerRef.current?._getSubmitData() as Record<string, unknown>;
                    return submitData ? submitData[key] : undefined;
                }, reset() {
                    formViewerRef.current?.reset();
                }, setEnabled(enabled: boolean) {
                    formViewerRef.current?.setProperty("disabled", !enabled);
                }, setFieldValue(key: string, value: unknown) {
                    const state = formViewerRef?.current?._getState();
                    const data = state ? {...state.data} : {};
                    data[key] = value;
                    const newState = {...state, data: data};
                    formViewerRef?.current?._setState(newState);
                }, setReadOnly(readOnly: boolean) {
                    formViewerRef.current?.setProperty("readOnly", readOnly);
                }, submit(): SubmitEventResult {
                    return formViewerRef?.current?.submit();
                }, validate(): FormErrors {
                    return formViewerRef.current?.validate();
                }, setErrors(errors: FormErrors) {
                    const state = formViewerRef?.current?._getState();
                    const currentErrors = state?.errors ? {...state.errors} : {};
                    const newErrors = {...currentErrors, ...errors};
                    const newState = {...state, errors: newErrors};
                    formViewerRef?.current?._setState(newState);
                }, removeFieldError(id: string) {
                    const state = formViewerRef?.current?._getState();
                    const errors = state?.errors ? {...state.errors} : {};
                    delete errors[id];
                    const newState = {...state, errors: errors};
                    formViewerRef?.current?._setState(newState);
                }
            };
        },
        []);

    useEffect(() => {
        if (schema) {
            formViewerRef?.current?.importSchema(schema, initialData as Record<string, unknown>)
                .catch((error: unknown) => {
                    console.error("Unable to import form schema error: ", error);
                    setImportSchemaError(error);
                    if (onImportError) {
                        onImportError(error);
                    }
                });
        }
    }, [form, schema, initialData, onImportError]);

    //todo: i18n
    return (
        <>
            {importSchemaError !== undefined && <Text type="danger">Unable to import form schema</Text>}
            <div id="form-js-form-container" ref={formContainerRef} {...divProps}>
            </div>
        </>
    );
});


