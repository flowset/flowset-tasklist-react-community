/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    CamundaFormData,
    CamundaHistoricProcessInstance,
    CamundaHistoricProcessInstanceRequest,
    CamundaHistoricTask,
    CamundaProcessDefinition,
    CamundaProcessInstance,
    CamundaTask,
    CamundaUserTaskRequest,
    CamundaVariablesMap
} from "./types";
import {
    createActiveTasksCountRequest,
    createMonthlyTasksCountRequest,
    createOverdueTasksCountRequest,
    createRecentTasksRequest,
    createWeeklyTasksRequest
} from "./utils/dashboard-requests.ts";
import {sortByField} from "@utils/sort";
import {filterByAnyField} from "@utils/filtering";
import dayjs from "dayjs";
import type {TasklistClientOptions} from "@features/tasklist-client/types/client.ts";
import {
    convertCamundaFormToProcessForm,
    convertContentTypeToFormType,
    convertCountDtoToCount,
    convertEnrichUserTask,
    convertHistoricTasksToStatistics,
    convertProcessDefinitions,
    convertProcessInstances,
    convertUserTask,
    convertUserTasks,
    convertVariablesMap
} from "./converters/response-converters.ts";
import {
    convertToInputVariablesMap,
    convertToUserProcessInstanceRequest,
    convertToUserTaskRequest
} from "./converters/request-converters.ts";
import {buildUrl} from "./utils/camunda-url-builder.ts";
import {fetchParallel, type RequestData} from "@features/tasklist-client/http/fetch-utils.ts";
import {HttpError} from "@utils/errors/HttpError.ts";
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
} from "@features/tasklist-client/types/request.ts";
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
} from "@features/tasklist-client/types/response.ts";
import {BaseHttpTasklistClient} from "@features/tasklist-client/http/BaseHttpTasklistClient.ts";
import type {TaskExecutionPeriodStatistics, UserTask} from "@models/user-task.ts";
import type {ProcessInstance, UserProcessInstance} from "@models/process.ts";
import {FormType, type ProcessFormData} from "@models/form.ts";

/**
 * Tasklist Client implementation for Camunda 7 engine and using Camunda 7 REST API.
 */
export class CamundaPlatformClient extends BaseHttpTasklistClient {
    protected taskUri: string;
    protected processUri: string;

    constructor(options: TasklistClientOptions) {
        super(options);
        this.taskUri = `${this.apiUrl}/task`;
        this.processUri = `${this.apiUrl}/process-definition`;
    }

    async getUserTasks(params: GetUserTaskListParams): Promise<GetUserTaskListResult> {
        if (!params) {
            console.warn("Params to load tasks is missing.");
            return Promise.reject(new Error("Invalid params to load tasks."));
        }
        const requestBody: CamundaUserTaskRequest = convertToUserTaskRequest(params);

        const userTaskRequest: RequestData<UserTask[]> = {
            promise: this.post(buildUrl(this.taskUri, params?.pagination), requestBody),
            converter: (data?: unknown) => convertUserTasks(data as CamundaTask[] || [])
        };
        const userTaskCountRequest: RequestData<number> = {
            promise: this.post(`${this.taskUri}/count`, requestBody),
            converter: (data?: unknown) => convertCountDtoToCount(data)
        };

        return fetchParallel({
            userTasks: userTaskRequest,
            userCount: userTaskCountRequest
        })
            .then(value => {
                const userTasks = value.userTasks || [];
                const totalElements = value.userCount || 0;

                const processDefinitionIds = userTasks.flatMap(task =>
                    task.processDefinition?.id ? [task.processDefinition.id] : []
                );

                if (!processDefinitionIds || processDefinitionIds.length === 0) {
                    return {
                        data: userTasks || [],
                        totalElements: totalElements,
                    };
                }
                const processDefinitionsPromise = this.getProcessDefinitionsByIds(processDefinitionIds);
                return processDefinitionsPromise.then((processDefinitions: CamundaProcessDefinition[]) => {
                    const enrichedUserTasks = userTasks?.map(task => convertEnrichUserTask(task, processDefinitions));

                    return {
                        data: enrichedUserTasks,
                        totalElements: totalElements,
                    };
                });
            });

    }

    async getUserTaskById(params: GetUserTaskParams): Promise<GetUserTaskResult> {
        const {taskId} = params;
        return this.getWithResult<CamundaTask>(`${this.taskUri}/${taskId}`)
            .then((value: CamundaTask) => {
                const userTask = convertUserTask(value);

                const processDefinitionId = userTask.processDefinition?.id;
                if (!processDefinitionId) {
                    return userTask;
                }
                const processDefinitionsPromise = this.getProcessDefinitionsByIds([processDefinitionId]);
                return processDefinitionsPromise.then((processDefinitions: CamundaProcessDefinition[]) => {
                    return convertEnrichUserTask(userTask, processDefinitions);
                });
            });
    }

    async getTaskFormData(params: GetTaskFormDataParams): Promise<GetTaskFormResult> {
        const {taskId} = params;

        return this.getWithResult<CamundaFormData>(`${this.taskUri}/${taskId}/form`)
            .then((result: CamundaFormData) => {
                const taskForm = convertCamundaFormToProcessForm(result);
                if (!taskForm || !taskForm.formKey || taskForm.type == FormType.EMBEDDED) {
                    return taskForm;
                }
                return this.getDeployedForm(`${this.taskUri}/${taskId}/deployed-form`, taskForm);
            });
    }

    async submitTaskForm(params: CompleteTaskParams): Promise<CompeteUserTaskResult> {
        const {taskId, data} = params;
        const variables = convertToInputVariablesMap(data);

        return this.post(`${this.taskUri}/${taskId}/submit-form`, variables)
            .then(() => undefined);
    }

    async getTaskFormVariables(params: GetTaskFormVariablesParams): Promise<GetTaskFormVariablesResult> {
        const {taskId} = params;
        return this.getWithResult<CamundaVariablesMap>(`${this.taskUri}/${taskId}/form-variables`)
            .then((camundaVariables: CamundaVariablesMap) => {
                return convertVariablesMap(camundaVariables);
            });
    }

    async getProcesses(params: GetProcessListParams | undefined): Promise<GetProcessListResult> {
        const pagination = params?.pagination;
        const sort = params?.sort;
        const filter = params?.filter;

        const queryParams = {
            "latestVersion": "true",
            "startableInTasklist": "true",
            "active": "true"
        };

        return this.getWithResult<CamundaProcessDefinition[]>(this.processUri, queryParams)
            .then(processList => {
                const searchString = filter?.nameOrKeyOrDescriptionLike;
                let data = filterByAnyField<CamundaProcessDefinition>(processList, ["name", "key", "description"], searchString);
                data = sortByField<CamundaProcessDefinition>(data, sort);

                if (pagination) {
                    const startIndex = pagination.page * pagination.size;
                    const endIndex = startIndex + pagination.size;
                    data = data.slice(startIndex, endIndex);
                }
                return {
                    data: convertProcessDefinitions(data),
                    totalElements: processList.length
                };
            });
    }

    async getUserProcessInstances(params: GetUserProcessInstanceListParams): Promise<UserProcessInstanceListResult> {
        const request: CamundaHistoricProcessInstanceRequest = convertToUserProcessInstanceRequest(params);

        const instanceListRequest: RequestData<UserProcessInstance[]> = {
            promise: this.post(buildUrl(`${this.apiUrl}/history/process-instance`, params?.pagination), request),
            converter: (data?: unknown) => convertProcessInstances(data as CamundaHistoricProcessInstance[] || [])
        };
        const instanceCountRequest: RequestData<number> = {
            promise: this.post(`${this.apiUrl}/history/process-instance/count`, request),
            converter: (data?: unknown) => convertCountDtoToCount(data)
        };

        return fetchParallel({
            instances: instanceListRequest,
            instanceCount: instanceCountRequest
        })
            .then(value => {
                const processInstances = value.instances || [];
                const totalElements = value.instanceCount || 0;

                return {
                    data: processInstances || [],
                    totalElements: totalElements,
                };
            });
    }

    async getStartFormData(params: GetStartFormDataParams): Promise<GetStartFormResult> {
        const {processDefinitionId} = params;
        return this.getWithResult<CamundaFormData>(`${this.processUri}/${processDefinitionId}/startForm`)
            .then((result: CamundaFormData) => {
                const startForm = convertCamundaFormToProcessForm(result);
                if (!startForm || !startForm.formKey || startForm.type === FormType.EMBEDDED) {
                    return startForm;
                }

                return this.getDeployedForm(`${this.processUri}/${processDefinitionId}/deployed-start-form`, startForm);

            });
    }

    async startProcess(params: StartProcessParams): Promise<StartProcessResult> {
        const {processDefinitionId, variables, businessKey} = params;

        const variablesMap = convertToInputVariablesMap(variables);
        const requestBody = {
            ...variablesMap,
            businessKey
        };
        const url = `${this.processUri}/${processDefinitionId}/submit-form`;

        return this.postWithResult<CamundaProcessInstance>(url, requestBody)
            .then(value => value as ProcessInstance);
    }

    async getUserTaskStatistics(params?: GetUserTaskStatisticsParams): Promise<GetUserTaskStatisticsResult> {
        if (!params) {
            console.warn("Params to load dashboard data is missing.");
            return Promise.reject(new Error("Invalid params to dashboard data."));
        }
        if (!params?.username) {
            return Promise.reject(new Error("Username is not passed as params"));
        }

        const currentDate = dayjs();

        const activeTaskCountRequest: RequestData<number | undefined> = {
            promise: this.post(`${this.taskUri}/count`, createActiveTasksCountRequest(params.username)),
            converter: (data?: unknown) => convertCountDtoToCount(data)
        };
        const overDueTasksCountRequest: RequestData<number | undefined> = {
            promise: this.post(`${this.taskUri}/count`, createOverdueTasksCountRequest(params.username, currentDate)),
            converter: (data?: unknown) => convertCountDtoToCount(data)
        };

        const recentTasksRequest: RequestData<UserTask[]> = {
            promise: this.post(`${this.taskUri}?firstResult=0&maxResults=5`, createRecentTasksRequest(params.username)),
            converter: (data?: unknown) => convertUserTasks(data as CamundaTask[] || [])
        };

        const weeklyTasksRequest: RequestData<TaskExecutionPeriodStatistics> = {
            promise: this.post(`${this.apiUrl}/history/task`, createWeeklyTasksRequest(params.username, currentDate)),
            converter: (data?: unknown) => convertHistoricTasksToStatistics(data as CamundaHistoricTask[] || [])
        };

        const monthlyAllTasksCountRequest: RequestData<number | undefined> = {
            promise: this.post(`${this.apiUrl}/history/task/count`, createMonthlyTasksCountRequest(params.username, currentDate)),
            converter: (data?: unknown) => convertCountDtoToCount(data)
        };
        const monthlyCompletedTasksCountRequest: RequestData<number | undefined> = {
            promise: this.post(`${this.apiUrl}/history/task/count`, createMonthlyTasksCountRequest(params.username, currentDate, true)),
            converter: (data?: unknown) => convertCountDtoToCount(data)
        };

        return fetchParallel({
            activeTasksCount: activeTaskCountRequest,
            overDueTasksCount: overDueTasksCountRequest,
            lastCreatedTasks: recentTasksRequest,
            weeklyActivity: weeklyTasksRequest,
            totalMonthTasks: monthlyAllTasksCountRequest,
            completedMonthTasks: monthlyCompletedTasksCountRequest,
        })
            .then(responseMap => {
                return {
                    activeTasksCount: responseMap.activeTasksCount || 0,
                    overdueTasksCount: responseMap.overDueTasksCount || 0,
                    lastCreatedTasks: responseMap.lastCreatedTasks,
                    weeklyActivity: responseMap.weeklyActivity,
                    monthlyStatistics: {
                        totalTasks: responseMap.totalMonthTasks || 0,
                        completedTasksCount: responseMap.completedMonthTasks || 0
                    }
                };
            });
    }

    protected async getProcessDefinitionsByIds(ids: string[]) {
        const url = buildUrl(this.processUri, undefined, undefined, {
            "processDefinitionIdIn": ids.join(",")
        });
        return this.getWithResult<CamundaProcessDefinition[]>(url);
    };

    protected async getDeployedForm(url: string, defaultForm: ProcessFormData) {
        return this.get(url)
            .then(response => {
                const formType = convertContentTypeToFormType(response.headers.get("content-type"));
                return response.text().then(responseContent => {
                    return {
                        ...defaultForm,
                        type: formType,
                        content: responseContent
                    }
                });
            }).catch(reason => {
                if (reason instanceof HttpError && reason.status === 400) {
                    return defaultForm;
                }
                console.error(`Unable to load deployed form by url: ${url}`, reason);
                throw reason;
            });
    }

}