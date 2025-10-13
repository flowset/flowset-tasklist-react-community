/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    PaginationPayload,
    SortPayload
} from "@models/common.ts";
import type {ProcessFilterPayload, ProcessInstanceFilterPayload} from "@models/process.ts";
import type {TaskFilterPayload} from "@models/user-task.ts";

/**
 * Type alias for HTTP request headers
 */
export type RequestHeaders = Record<string, string> | Headers;

/**
 * Function type that provides request headers
 */
export type RequestProvider = () => RequestHeaders;

/**
 * Type alias for task identifier
 */
export type TaskIdentifier = string;

/**
 * Type alias for process identifier
 */
export type ProcessIdentifier = string;

/**
 * Type alias for task completion variables
 */
export type CompleteTaskData = Record<string, unknown>;
/**
 * Type alias for process start variables
 */
export type StartProcessData = unknown;

/**
 * Interface indicating presence of task identifier
 */
export interface WithTaskId  {
    /**
     * ID of the user task
     */
    taskId: TaskIdentifier;
}

/**
 * Interface indicating presence of process identifier
 */
export interface WithProcessId {
    /**
     * ID of the process definition
     */
    processDefinitionId: ProcessIdentifier;
}

/**
 * Parameters for retrieving process definition list
 */
export interface GetProcessListParams {
    /**
     * Filter criteria for processes
     */
    filter?: ProcessFilterPayload;

    /**
     * Pagination settings
     */
    pagination?: PaginationPayload;

    /**
     * Sorting options
     */
    sort?: SortPayload
}

export interface GetUserProcessInstanceListParams {
    /**
     * Filter criteria for process instances
     */
    filter?: ProcessInstanceFilterPayload;

    /**
     * Pagination settings
     */
    pagination?: PaginationPayload;

    /**
     * Sorting options
     */
    sort?: SortPayload;

    /**
     * Username to filter tasks by assignee
     */
    username?: string;
}

/**
 * Parameters for starting a new process instance
 */
export interface StartProcessParams {
    /**
     * ID of the process definition to start
     */
    processDefinitionId: ProcessIdentifier;

    /**
     * Variables for a new process instance
     */
    variables?: StartProcessData;

    /**
     * Business key for a new process instance
     */
    businessKey?: string;
}


/**
 * Parameters for retrieving user tasks
 */
export interface GetUserTaskListParams {
    /**
     * Pagination settings
     */
    pagination?: PaginationPayload;
    /**
     * Sorting options
     */
    sort?: SortPayload;
    /**
     * Filter criteria
     */
    filter?: TaskFilterPayload;

    /**
     * Username to filter tasks by assignee
     */
    username?: string;
}

/**
 * Parameters for retrieving a specific user task
 */
export type GetUserTaskParams = WithTaskId;

/**
 * Parameters for retrieving user task form data
 */
export type GetTaskFormDataParams = WithTaskId;

/**
 * Parameters for retrieving user task form variables
 */
export type GetTaskFormVariablesParams = WithTaskId;

/**
 * Parameters for completing a user task
 */
export interface CompleteTaskParams extends WithTaskId {
    data?: CompleteTaskData;
}

/**
 * Parameters for retrieving process start form data
 */
export type GetStartFormDataParams = WithProcessId;

/**
 * Parameters for retrieving user task statistics
 */
export interface GetUserTaskStatisticsParams {
    /**
     * Optional username to filter statistics by user
     */
    username?: string;
}