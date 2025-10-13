/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ITasklistClient, TasklistClientHeaders, TasklistClientOptions} from "../types/client.ts";
import type {
    CompleteTaskParams,
    GetProcessListParams,
    GetStartFormDataParams,
    GetTaskFormDataParams,
    GetTaskFormVariablesParams,
    GetUserProcessInstanceListParams,
    GetUserTaskListParams,
    GetUserTaskParams,
    GetUserTaskStatisticsParams,
    StartProcessParams
} from "../types/request.ts";
import type {
    CompeteUserTaskResult,
    GetProcessListResult,
    GetStartFormResult,
    GetTaskFormResult,
    GetTaskFormVariablesResult,
    GetUserTaskListResult,
    GetUserTaskResult,
    GetUserTaskStatisticsResult,
    StartProcessResult,
    UserProcessInstanceListResult
} from "../types/response.ts";
import {fetchGet, fetchGetJson, fetchPost, fetchPostJson} from "./fetch-utils.ts";
import {buildUrlWithParams} from "./url-builder.ts";

/**
 * Abstract base class for HTTP-based Tasklist backend API.
 * Provides common functionality for making HTTP requests and handling authentication headers.
 * Concrete implementations must provide specific backend implementations.
 *
 * @see CamundaPlatformClient
 * @see OperatonClient
 */
export abstract class BaseHttpTasklistClient implements ITasklistClient {
    protected readonly apiUrl: string;
    protected readonly headers?: TasklistClientHeaders;

    protected constructor(options: TasklistClientOptions) {
        this.apiUrl = options.apiUrl;
        this.headers = options.headers;
    }

    abstract getUserTasks(params: GetUserTaskListParams): Promise<GetUserTaskListResult>;

    abstract getUserTaskById(params: GetUserTaskParams): Promise<GetUserTaskResult>;

    abstract getTaskFormData(params: GetTaskFormDataParams): Promise<GetTaskFormResult>;

    abstract getTaskFormVariables(params: GetTaskFormVariablesParams): Promise<GetTaskFormVariablesResult>;

    abstract submitTaskForm(params: CompleteTaskParams): Promise<CompeteUserTaskResult>;

    abstract getProcesses(params: GetProcessListParams | undefined): Promise<GetProcessListResult>;

    abstract getUserProcessInstances(params: GetUserProcessInstanceListParams): Promise<UserProcessInstanceListResult>;

    abstract getStartFormData(params: GetStartFormDataParams): Promise<GetStartFormResult>;

    abstract startProcess(params: StartProcessParams): Promise<StartProcessResult>;

    abstract getUserTaskStatistics(params?: GetUserTaskStatisticsParams): Promise<GetUserTaskStatisticsResult>;

    protected async post(url: string, body?: unknown) {
        return fetchPost(url, body, this.createRequestHeaders());
    }

    protected async postWithResult<T>(url: string, body?: unknown) {
        return fetchPostJson<T>(url, body, this.createRequestHeaders());
    }

    protected async get(url: string, queryParams?: Record<string, string>) {
        const resultUrl = buildUrlWithParams(url, queryParams);

        return fetchGet(resultUrl, this.createRequestHeaders());
    }

    protected async getWithResult<T>(url: string, queryParams?: Record<string, string>) {
        const resultUrl = buildUrlWithParams(url, queryParams);

        return fetchGetJson<T>(resultUrl, this.createRequestHeaders());
    }

    protected createRequestHeaders() {
        let resultHeaders: HeadersInit = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        if (this.headers) {
            const rootHeaders = typeof this.headers === "function" ? this.headers() : this.headers;
            if (rootHeaders instanceof Headers) {
                for (const entry of rootHeaders.entries()) {
                    resultHeaders[entry[0]] = entry[1];
                }
            } else {
                resultHeaders = {...resultHeaders, ...rootHeaders};
            }
        }

        return resultHeaders;
    }

}