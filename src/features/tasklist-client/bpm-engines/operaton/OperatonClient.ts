/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {CamundaPlatformClient} from "../camunda/CamundaPlatformClient.ts";

import {filterByAnyField} from "@utils/filtering";
import {sortByField} from "@utils/sort";
import type {TaskExecutionPeriodStatistics, UserTask} from "@models/user-task.ts";
import type {ProcessInstance} from "@models/process.ts";
import {FormType} from "@models/form.ts";
import {createTaskFormDataStub, USE_DEPLOYED_FORM_STUB} from "@features/tasklist-client/stubs/deployed-form-stub.ts";

import dayjs from "dayjs";

import type {
    OperatonFormData,
    OperatonHistoricTask,
    OperatonProcessDefinition,
    OperatonProcessInstance,
    OperatonTask,
    OperatonVariablesMap
} from "./types/response.ts";
import {
    convertCountDtoToCount,
    convertEnrichUserTask,
    convertHistoricTasksToStatistics,
    convertOperatonFormToProcessForm,
    convertProcessDefinitions,
    convertUserTask,
    convertUserTasks,
    convertVariablesMap
} from "./converters/response-converters.ts";
import type {OperatonUserTaskRequest} from "./types/request.ts";
import {
    createActiveTasksCountRequest,
    createMonthlyTasksCountRequest,
    createOverdueTasksCountRequest,
    createRecentTasksRequest,
    createWeeklyTasksRequest
} from "./utils/dashboard-requests.ts";
import type {
    CompleteTaskParams,
    GetProcessListParams,
    GetStartFormDataParams,
    GetTaskFormDataParams,
    GetTaskFormVariablesParams,
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
    StartProcessResult
} from "@features/tasklist-client/types/response.ts";
import {convertToInputVariablesMap, convertToUserTaskRequest} from "./converters/request-converters.ts";
import {fetchParallel, type RequestData} from "@features/tasklist-client/http/fetch-utils.ts";
import {buildUrl} from "../camunda/utils/camunda-url-builder.ts";

/**
 * Tasklist Client implementation for Operaton engine and using Operaton REST API.
 */
export class OperatonClient extends CamundaPlatformClient {
    async getProcesses(params: GetProcessListParams | undefined): Promise<GetProcessListResult> {
        const pagination = params?.pagination;
        const sort = params?.sort;
        const filter = params?.filter;

        const queryParams = {
            "latestVersion": "true",
            "startableInTasklist": "true"
        };

        return this.getWithResult<OperatonProcessDefinition[]>(this.processUri, queryParams)
            .then(processList => {
                const searchString = filter?.nameOrKeyOrDescriptionLike;
                let data = filterByAnyField<OperatonProcessDefinition>(processList, ["name", "key", "description"], searchString);
                data = sortByField<OperatonProcessDefinition>(data, sort);

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

    async getStartFormData(params: GetStartFormDataParams): Promise<GetStartFormResult> {
        if (USE_DEPLOYED_FORM_STUB) {
            console.warn(`[stub] Skipping start form API for process ${params.processDefinitionId}; returning fixture schema`);
            return createTaskFormDataStub();
        }

        const {processDefinitionId} = params;
        return this.getWithResult<OperatonFormData>(`${this.processUri}/${processDefinitionId}/startForm`)
            .then((result: OperatonFormData) => {
                const startForm = convertOperatonFormToProcessForm(result);
                if (!startForm || !startForm.formKey || startForm.type === FormType.EMBEDDED) {
                    return startForm;
                }

                return this.getDeployedForm(`${this.processUri}/${processDefinitionId}/deployed-start-form`, startForm);

            });
    }

    async getTaskFormData(params: GetTaskFormDataParams): Promise<GetTaskFormResult> {
        if (USE_DEPLOYED_FORM_STUB) {
            console.warn(`[stub] Skipping task form API for task ${params.taskId}; returning fixture schema`);
            return createTaskFormDataStub();
        }

        const {taskId} = params;

        return this.getWithResult<OperatonFormData>(`${this.taskUri}/${taskId}/form`)
            .then((result: OperatonFormData) => {
                const taskForm = convertOperatonFormToProcessForm(result);
                if (!taskForm || !taskForm.formKey || taskForm.type == FormType.EMBEDDED) {
                    return taskForm;
                }
                return this.getDeployedForm(`${this.taskUri}/${taskId}/deployed-form`, taskForm);
            });
    }

    async getTaskFormVariables(params: GetTaskFormVariablesParams): Promise<GetTaskFormVariablesResult> {
        const {taskId} = params;
        return this.getWithResult<OperatonVariablesMap>(`${this.taskUri}/${taskId}/form-variables`)
            .then((operatonVariables: OperatonVariablesMap) => {
                return convertVariablesMap(operatonVariables);
            });
    }

    async getUserTaskById(params: GetUserTaskParams): Promise<GetUserTaskResult> {
        const {taskId} = params;
        return this.getWithResult<OperatonTask>(`${this.taskUri}/${taskId}`)
            .then((value: OperatonTask) => {
                const userTask = convertUserTask(value);

                const processDefinitionId = userTask.processDefinition?.id;
                if (!processDefinitionId) {
                    return userTask;
                }
                const processDefinitionsPromise = this.getProcessDefinitionsByIds([processDefinitionId]);
                return processDefinitionsPromise.then((processDefinitions: OperatonProcessDefinition[]) => {
                    return convertEnrichUserTask(userTask, processDefinitions);
                });
            });
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
            converter: (data?: unknown) => convertUserTasks(data as OperatonTask[] || [])
        };

        const weeklyTasksRequest: RequestData<TaskExecutionPeriodStatistics> = {
            promise: this.post(`${this.apiUrl}/history/task`, createWeeklyTasksRequest(params.username, currentDate)),
            converter: (data?: unknown) => convertHistoricTasksToStatistics(data as OperatonHistoricTask[] || [])
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

    async getUserTasks(params: GetUserTaskListParams): Promise<GetUserTaskListResult> {
        if (!params) {
            console.warn("Params to load tasks is missing.");
            return Promise.reject(new Error("Invalid params to load tasks."));
        }
        const requestBody: OperatonUserTaskRequest = convertToUserTaskRequest(params);

        const userTaskRequest: RequestData<UserTask[]> = {
            promise: this.post(buildUrl(this.taskUri, params?.pagination), requestBody),
            converter: (data?: unknown) => convertUserTasks(data as OperatonTask[] || [])
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
                return processDefinitionsPromise.then((processDefinitions: OperatonProcessDefinition[]) => {
                    const enrichedUserTasks = userTasks?.map(task => convertEnrichUserTask(task, processDefinitions));

                    return {
                        data: enrichedUserTasks,
                        totalElements: totalElements,
                    };
                });
            })

    }

    async startProcess(params: StartProcessParams): Promise<StartProcessResult> {
        const {processDefinitionId, variables, businessKey} = params;

        const variablesMap = convertToInputVariablesMap(variables);
        const requestBody = {
            ...variablesMap,
            businessKey
        };

        const url = `${this.processUri}/${processDefinitionId}/submit-form`;

        return this.postWithResult<OperatonProcessInstance>(url, requestBody)
            .then(value => value as ProcessInstance);
    }

    async submitTaskForm(params: CompleteTaskParams): Promise<CompeteUserTaskResult> {
        const {taskId, data} = params;
        const variables = convertToInputVariablesMap(data);

        return this.post(`${this.taskUri}/${taskId}/submit-form`, variables)
            .then(response => {
                if (response.ok) {
                    return;
                }
                return Promise.reject(response);
            });
    }
}