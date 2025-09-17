/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Representation of process used in the OpenBPM Tasklist pages.
 */
export interface ProcessDefinition {
    id: string;
    name?: string;
    version?: number;
    description?: string;
    key?: string;
    versionTag?: string;
}

/**
 * Representation of process instance for the OpenBPM Tasklist pages.
 */
export interface ProcessInstance {
    id: string;
    processDefinitionId: string;
    businessKey?: string
}

/**
 * Representation of user task used in the OpenBPM Tasklist pages.
 */
export interface UserTask {
    id: string;
    name?: string;
    description?: string | null;
    dueDate?: string | null;
    createDate?: string;
    taskDefinitionKey: string;
    processInstanceId: string;
    formKey?: string;
    priority?: number;
    processDefinition?: ProcessDefinition;
    assignee?: string;
}

/**
 * Representation of user task or start forms used in the OpenBPM Tasklist pages.
 */
export interface ProcessFormData {
    formKey?: string;
    version?: number;
    content?: string;
    type: FormType;
}

/**
 * Representation of the Dashboard data.
 */
export interface UserTaskStatistics {
    activeTasksCount?: number;
    overdueTasksCount?: number;
    upcomingTasks?: UserTask[];
    lastCreatedTasks?: UserTask[];
    weeklyActivity?: TaskExecutionPeriodStatistics;
    monthlyStatistics?: TaskExecutionStatistics;
}

export interface TaskExecutionPeriodStatistics extends TaskExecutionStatistics {
    items?: TaskExecutionDateStatistics[]
}

export interface TaskExecutionDateStatistics extends TaskExecutionStatistics {
    date?: string
}

export interface TaskExecutionStatistics {
    totalTasks: number;
    completedTasksCount: number;
}

/**
 * Type of user task and start forms used in the processes
 */
export enum FormType {
    HTML = 'HTML',
    FORM_JS_JSON = 'FORM_JS_JSON',
    EMBEDDED = 'EMBEDDED',
    CUSTOM = 'CUSTOM'
}

/**
 * Pagination settings used on the OpenBPM Tasklist pages.
 */
export interface PaginationPayload {
    page: number;
    size: number;
}

/**
 * Sort options used on the OpenBPM Tasklist pages.
 */
export interface SortPayload {
    property: string;
    order: SortOrder | string;
}

export enum SortOrder {
    Asc = "asc",
    Desc = "desc"
}

export interface InitialData {
    [key: string]: unknown;
}


export interface TaskFilterPayload {
    assignee?: string;
    nameLike?: string;
    processDefinitionNameLike?: string;
    minPriority?: number;
    maxPriority?: number;
    withoutDueDate?: boolean;
    dueDateBefore?: string;
    dueDateAfter?: string;
    createDateBefore?: string;
    createDateAfter?: string;
}

export interface ProcessFilterPayload {
    nameOrKeyOrDescriptionLike?: string;
}