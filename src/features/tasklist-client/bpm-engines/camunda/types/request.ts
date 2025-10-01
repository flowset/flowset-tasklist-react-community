/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Request to load runtime user tasks from the Camunda.
 */
export interface CamundaUserTaskRequest extends CamundaTaskFilter {
    sorting?: CamundaSort[];

}

/**
 * Request to load historic user tasks from the Camunda.
 */
export interface CamundaHistoricTaskRequest {
    taskAssignee?: string;
    startedAfter?: string;
    startedBefore?: string;
    finished?: boolean;
}

/**
 * Sorting options in the Camunda requests
 */
export interface CamundaSort {
    sortBy?: string;
    sortOrder?: string;
}

/**
 * Process variables map
 */
export interface CamundaInputVariablesMap {
    variables: Record<string, unknown>;
}

/**
 * Filtering options for runtime user tasks in Camunda
 */
export interface CamundaTaskFilter {
    assignee?: string;
    dueBefore?: string;
    dueAfter?: string;
    withoutDueDate?: boolean;
    nameLike?: string;
    processDefinitionNameLike?: string;
    minPriority?: number;
    maxPriority?: number;
    createdAfter?: string;
    createdBefore?: string;
    active?: boolean;
}

export interface HistoricProcessInstanceFilter {
    startedBy?: string;
    processDefinitionNameLike? : string;
    processInstanceBusinessKeyLike?: string;
    unfinished?: boolean;
    startedAfter?: string;
    startedBefore?: string;
    active?: boolean;
}

export interface CamundaHistoricProcessInstanceRequest extends HistoricProcessInstanceFilter {
    sorting?: CamundaSort[];

}