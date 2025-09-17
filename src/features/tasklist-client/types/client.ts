/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    CompleteTaskParams,
    GetProcessListParams,
    GetStartFormDataParams,
    GetTaskFormDataParams,
    GetTaskFormVariablesParams,
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
    StartProcessResult
} from "./response.ts";

export type TasklistClientHeaders = RequestHeaders | RequestProvider;

/**
 * OpenBPM Tasklist backend connection options
 */
export interface TasklistClientOptions {

    /**
     * Backend base URI or URL, e.g. BPM engine REST API base path (/engine-rest).
     */
    apiUrl: string;

    /**
     * Headers to send in each request to OpenBPM Tasklist backend, e.g. the "Authorization" header
     */
    headers?: TasklistClientHeaders;
}

/**
 * Client interface for interacting with OpenBPM Tasklist backend API.
 */
export interface ITasklistClient {

    /**
     * Loads the active tasks assigned to the current user.
     * @param params request params such as filter, sort options, pagination etc
     */

    getUserTasks: (params: GetUserTaskListParams) => Promise<GetUserTaskListResult>;

    /**
     * Loads an active task using the specified identifier.
     * @param params request params such as task id
     */
    getUserTaskById: (params: GetUserTaskParams) => Promise<GetUserTaskResult>;

    /**
     * Loads a form data for the active task with the specified identifier.
     * @param params request params such as task id
     */
    getTaskFormData: (params: GetTaskFormDataParams) => Promise<GetTaskFormResult>;

    /**
     * Loads form variables for the provided task that are used as initial data.
     * @param params request params such as task id
     */
    getTaskFormVariables: (params: GetTaskFormVariablesParams) => Promise<GetTaskFormVariablesResult>;

    /**
     * Submits a form data for the active task with the specified identifier.
     * @param params request params such as task id and form variables
     */
    submitTaskForm: (params: CompleteTaskParams) => Promise<CompeteUserTaskResult>;
    /**
     * Loads a list of active process definitions that can be started from the Tasklist.
     * @param params request params such as filter, sort and pagination data
     */
    getProcesses: (params: GetProcessListParams) => Promise<GetProcessListResult>;

    /**
     * Loads a start form data for the provided process definition.
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
