/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {JSX} from "react";
import type {ProcessFormData} from "@models/form.ts";
import type {UserTask} from "@models/user-task.ts";
import type {ProcessDefinition} from "@models/process.ts";

/**
 * Configuration interface for custom forms with generic input/output variables
 */
export interface CustomFormConfig<InputVariables = FormData, OutputVariables = FormData, > {
    /**
     * Unique identifier key for the form that is used in the BPMN diagram
     */
    formKey: string;

    /**
     * React component that renders the custom form
     */
    component: (props: CustomFormProps<InputVariables, OutputVariables>) => JSX.Element | null;
}

/**
 * Union type for custom form props, supporting both task forms and start forms
 */
export type CustomFormProps<InputVariables = FormData, OutputVariables = FormData> =
    CustomTaskFormProps<InputVariables, OutputVariables> | CustomStartFormProps<OutputVariables>

/**
 * Props interface for custom task forms with input/output variable typing
 */
export interface CustomTaskFormProps<InputVariables = FormData, OutputVariables = FormData> {
    /**
     * Process form metadata
     */
    formData: ProcessFormData;
    /**
     * Input variables passed to the form that can be used as initial values
     */
    inputVariables?: InputVariables;

    /**
     * Callback function for form submission to complete the task with the provided variables
     */
    onSubmit: (data?: OutputVariables) => void;

    /**
     * Optional callback function for form cancellation, e.g. to close the task
     */
    onCancel: () => void;

    /**
     * Boolean indicating if task completing is in progress
     */
    submitInProgress?: boolean;

    /**
     * User task data associated with the form
     */
    task?: UserTask;
}

/**
 * Props interface for custom process start forms set for Start event
 */
export interface CustomStartFormProps<OutputVariables = FormData> {
    /**
     * Start process form metadata
     */
    formData: ProcessFormData;

    /**
     * Callback function for starting a process with the provided variables and business key
     * @param data - process variables for new process instances
     * @param businessKey - business key for new process instances
     */
    onSubmit: (data?: OutputVariables, businessKey?: string) => void;

    /**
     * Boolean indicating if starting a process is in progress
     */
    submitInProgress?: boolean;

    /**
     * Optional callback function for form cancellation, e.g., to close the Start process dialog
     */
    onCancel: () => void;

    /**
     * Process definition data associated with the form
     */
    process?: ProcessDefinition;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormData = any;
