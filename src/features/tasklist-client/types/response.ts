/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    InitialData,
    ProcessDefinition,
    ProcessFormData,
    ProcessInstance,
    UserTask,
    UserTaskStatistics
} from "../../../types/common.ts";

/**
 * Result type for process list retrieval operation
 */
export type GetProcessListResult = ProcessListResult | undefined;

/**
 * Result type for process start operation
 */
export type StartProcessResult = ProcessInstance | undefined;

/**
 * Result type for user task list retrieval operation
 */
export type GetUserTaskListResult = GetTaskListResult | undefined;

/**
 * Result type for specific user task retrieval operation
 */
export type GetUserTaskResult = UserTask | undefined;

/**
 * Result type for task form data retrieval operation
 */
export type GetTaskFormResult = ProcessFormData | undefined | null;

/**
 * Result type for process start form data retrieval operation
 */
export type GetStartFormResult = ProcessFormData | undefined | null;

/**
 * Result type for task form variables retrieval operation
 */
export type GetTaskFormVariablesResult = InitialData | undefined;

/**
 * Result type for user task completion operation
 */
export type CompeteUserTaskResult = void;

/**
 * Result type for user task statistics retrieval operation
 */
export type GetUserTaskStatisticsResult = UserTaskStatistics | undefined;

/**
 * Generic entity list result with pagination information
 */
export type EntityListResult<T> = {
    /**
     * Array of items
     */
    data?: T[];

    /**
     * Total number of items
     */
    totalElements: number;
};

/**
 * Type alias for process definition list result
 */
export type ProcessListResult = EntityListResult<ProcessDefinition> | undefined;

/**
 * Type alias for user task list result
 */
export type GetTaskListResult = EntityListResult<UserTask> | undefined;