
/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {createContext} from "react";
import type {ITasklistClient} from "../types/client.ts";
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
} from "../types/request.ts";
import type {CompeteUserTaskResult, GetProcessListResult, GetStartFormResult, GetTaskFormResult, GetTaskFormVariablesResult,
    GetUserTaskListResult, GetUserTaskResult, GetUserTaskStatisticsResult,
    StartProcessResult} from "../types/response.ts";

const NONE_TASKLIST_CLIENT: ITasklistClient = {
    getProcesses(_params: GetProcessListParams): Promise<GetProcessListResult> {
        return Promise.resolve(undefined);
    }, getStartFormData(_params: GetStartFormDataParams): Promise<GetStartFormResult> {
        return Promise.resolve(undefined);
    }, getTaskFormData(_params: GetTaskFormDataParams): Promise<GetTaskFormResult> {
        return Promise.resolve(undefined);
    }, getTaskFormVariables(_params: GetTaskFormVariablesParams): Promise<GetTaskFormVariablesResult> {
        return Promise.resolve(undefined);
    }, getUserTaskById(_params: GetUserTaskParams): Promise<GetUserTaskResult> {
        return Promise.resolve(undefined);
    }, getUserTaskStatistics(_params: GetUserTaskStatisticsParams | undefined): Promise<GetUserTaskStatisticsResult> {
        return Promise.resolve(undefined);
    }, getUserTasks(_params: GetUserTaskListParams): Promise<GetUserTaskListResult> {
        return Promise.resolve(undefined);
    }, startProcess(_params: StartProcessParams): Promise<StartProcessResult> {
        return Promise.resolve(undefined);
    }, submitTaskForm(_params: CompleteTaskParams): Promise<CompeteUserTaskResult> {
        return Promise.resolve(undefined);
    }

}

export type TasklistClientContextType = ITasklistClient;

/**
 * React context to hold an instance of {@link ITasklistClient}.
 */
export const TasklistClientContext = createContext<TasklistClientContextType>(NONE_TASKLIST_CLIENT);