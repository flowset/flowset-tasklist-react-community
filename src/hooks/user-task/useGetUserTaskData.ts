
/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useGetTaskFormData, type UseGetTaskFormDataQueryOptions} from "./useGetTaskFormData.ts";
import {useGetUserTask, type UseGetUserTaskQueryOptions} from "./useGetUserTask.ts";
import {
    useGetTaskFormVariablesData,
    type UseGetTaskFormVariablesDataQueryOptions
} from "./useGetTaskFormVariablesData.ts";
import type { TaskIdentifier } from "../../features/tasklist-client/types/request.ts";
import type {InitialData, ProcessFormData, UserTask} from "../../types/common.ts";

/**
 * Props for fetching user task data including task details, form data, and initial variables
 * Extends base request parameters with task-specific query options
 */
export interface UseGetUserTaskDataProps {
    /**
     * Identifier of the task to fetch data for
     */
    taskId?: TaskIdentifier;
    /**
     * Query options for form data retrieval
     */
    formQueryOptions?: UseGetTaskFormDataQueryOptions;
    /**
     * Query options for task details retrieval
     */
    taskQueryOptions?: UseGetUserTaskQueryOptions;
    /**
     * Query options for initial task variables data
     */
    initialDataQueryOptions?: UseGetTaskFormVariablesDataQueryOptions;
}

/**
 * Result object containing user task data with loading states and errors
 * Provides comprehensive task information including form data and initial variables
 */
export interface UseGetUserTaskDataResult {
    /**
     * Identifier of the fetched task
     */
    taskId: TaskIdentifier;

    /**
     * Overall loading state for all data
     */
    isLoading: boolean;
    /**
     * Combined error for all data operations
     */
    error?: Error | null;

    /**
     *  Loading state specifically for task details
     */
    isTaskLoading: boolean;
    /**
     * Error from task details fetch operation
     */
    taskError?: Error | null;
    /**
     * Fetched user task data
     */
    task?: UserTask;

    /**
     * Loading state specifically for task form data
     */
    isFormLoading: boolean;
    /**
     * Error from task form data fetch operation
     */
    formError?: Error | null;
    /**
     * etched process form data
     */
    form?: ProcessFormData | null;

    /**
     * Loading state specifically for initial variables data
     */
    isInitialDataLoading: boolean;
    /**
     * Error from initial variables fetch operation
     */
    initialDataError?: Error | null;
    /**
     * Fetched initial task variables data
     */
    initialData?: InitialData;
}

/**
 * Hook to load a user task within form data by task id from backend.
 * @param props containing request params like task id and headers and options for "react-query" queries
 * @see useGetUserTask
 * @see useGetTaskFormData
 */
export const useGetUserTaskData = (props: UseGetUserTaskDataProps = {}): UseGetUserTaskDataResult => {
    const {
        taskId: propsTaskId,
        taskQueryOptions = {},
        formQueryOptions = {},
        initialDataQueryOptions = {},
    } = props;

    const {data: task, error: taskLoadError, isLoading: isTaskLoading} = useGetUserTask({
        taskId: propsTaskId!,
    }, {
        enabled: propsTaskId !== undefined,
        ...taskQueryOptions
    });

    const {data: taskForm, error: formLoadError, isLoading: isFormLoading} = useGetTaskFormData({
        taskId: propsTaskId!,
    }, {
        enabled: propsTaskId !== undefined,
        ...formQueryOptions
    });

    const {
        data: taskFormVariables,
        error: formVariablesLoadError,
        isLoading: isFormVariablesLoading
    } = useGetTaskFormVariablesData({
        taskId: propsTaskId!,
    }, {
        enabled: propsTaskId !== undefined,
        ...initialDataQueryOptions
    });

    if (!propsTaskId) {
        console.warn("useGetUserTaskData: User task id attribute must be not null");
    }

    return {
        taskId: propsTaskId || "",
        isLoading: isTaskLoading || isFormLoading || isFormVariablesLoading,
        error: taskLoadError || formLoadError || formVariablesLoadError,
        isTaskLoading: isTaskLoading,
        taskError: taskLoadError,
        task: task,
        isFormLoading: isFormLoading,
        formError: formLoadError,
        form: taskForm,
        initialData: taskFormVariables,
        initialDataError: formVariablesLoadError,
        isInitialDataLoading: isFormVariablesLoading
    }
}