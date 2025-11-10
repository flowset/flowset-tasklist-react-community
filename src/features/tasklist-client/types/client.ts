/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    CompleteTaskParams,
    GetProcessListParams,
    GetStartFormDataParams,
    GetTaskFormDataParams,
    GetTaskFormVariablesParams, GetUserProcessInstanceListParams,
    GetUserTaskListParams,
    GetUserTaskParams,
    GetUserTaskStatisticsParams,
    RequestHeaders,
    RequestProvider,
    StartProcessParams
} from "./request.ts";
import type {
    CompeteUserTaskResult,
    GetProcessListResult,
    GetStartFormResult,
    GetTaskFormResult,
    GetTaskFormVariablesResult,
    GetUserTaskListResult,
    GetUserTaskResult,
    GetUserTaskStatisticsResult,
    StartProcessResult, UserProcessInstanceListResult
} from "./response.ts";

export type TasklistClientHeaders = RequestHeaders | RequestProvider;

/**
 * Flowset Tasklist backend connection options
 */
export interface TasklistClientOptions {

    /**
     * Backend base URI or URL, e.g., BPM engine REST API base path (/engine-rest) or full URL (e.g., http://localhost:8080/engine-rest).
     */
    apiUrl: string;

    /**
     * Headers to send in each request to Flowset Tasklist backend, e.g. the "Authorization" header
     */
    headers?: TasklistClientHeaders;
}

/**
 * Client interface for interacting with Flowset Tasklist backend API.
 */
export interface ITasklistClient {

    /**
     * Loads the active tasks assigned to the current user.
     * @param params request params such as filter, sort options, pagination, etc.
     */

    getUserTasks: (params: GetUserTaskListParams) => Promise<GetUserTaskListResult>;

    /**
     * Loads an active task using the specified identifier.
     * @param params request params such as a task id
     */
    getUserTaskById: (params: GetUserTaskParams) => Promise<GetUserTaskResult>;

    /**
     * Loads form data for the active task with the specified identifier.
     * @param params request params such as a task id
     */
    getTaskFormData: (params: GetTaskFormDataParams) => Promise<GetTaskFormResult>;

    /**
     * Loads form variables for the provided task that are used as initial data.
     * @param params request params such as a task id
     */
    getTaskFormVariables: (params: GetTaskFormVariablesParams) => Promise<GetTaskFormVariablesResult>;

    /**
     * Submits form data for the active task with the specified identifier.
     * @param params request params such as task id and form variables
     */
    submitTaskForm: (params: CompleteTaskParams) => Promise<CompeteUserTaskResult>;
    /**
     * Loads a list of active process definitions that can be started from the Tasklist.
     * @param params request params such as filter, sort and pagination data
     */
    getProcesses: (params: GetProcessListParams) => Promise<GetProcessListResult>;

    /**
     * Retrieves a list of active process instances started by the provided user based on the specified parameters.
     *
     * @param {GetUserProcessInstanceListParams} params  request parameters used to filter and retrieve the user process instances.
     * @returns {Promise<UserProcessInstanceListResult>} promise that resolves to the result containing the list of user process instances.
     */
    getUserProcessInstances: (params: GetUserProcessInstanceListParams) => Promise<UserProcessInstanceListResult>;

    /**
     * Loads start form data for the provided process definition.
     * @param params request params such as process definition id
     */
    getStartFormData: (params: GetStartFormDataParams) => Promise<GetStartFormResult>;

    /**
     * Starts a new instance of the process using the specified key and variables.
     * @param params request params such as process definition key and process variables
     */
    startProcess: (params: StartProcessParams) => Promise<StartProcessResult>;

    /**
     * Loads task execution statistics for the current user.
     * @param params request params such as current user
     */
    getUserTaskStatistics: (params?: GetUserTaskStatisticsParams) => Promise<GetUserTaskStatisticsResult>
}
