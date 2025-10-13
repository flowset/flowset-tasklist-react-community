/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    CamundaSort,
    CamundaHistoricTaskRequest,
    CamundaTaskFilter,
    CamundaInputVariablesMap
} from "@features/tasklist-client/bpm-engines/camunda/types/request.ts";

export interface OperatonUserTaskRequest {
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
    sorting?: OperatonSort[];
}

export type OperatonTaskFilter = CamundaTaskFilter;
export type OperatonSort = CamundaSort;
export type OperatonHistoricTaskRequest = CamundaHistoricTaskRequest;
export type OperatonInputVariablesMap = CamundaInputVariablesMap;