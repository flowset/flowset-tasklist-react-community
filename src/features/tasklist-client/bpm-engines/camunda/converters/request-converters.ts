/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    CamundaHistoricProcessInstanceRequest,
    CamundaInputVariablesMap,
    CamundaSort,
    CamundaTaskFilter,
    CamundaUserTaskRequest,
    HistoricProcessInstanceFilter
} from "../types/request.ts";
import type {GetUserTaskListParams} from "@features/tasklist-client/types/request.ts";
import type {SortPayload} from "@models/common.ts";
import type {TaskFilterPayload} from "@models/user-task.ts";
import type {ProcessInstanceFilterPayload} from "@models/process.ts";


export const convertToCamundaTaskFilter = (filter: TaskFilterPayload | undefined): CamundaTaskFilter | undefined => {
    if (!filter) {
        return filter;
    }
    return {
        assignee: filter.assignee,
        dueBefore: filter.dueDateBefore,
        dueAfter: filter.dueDateAfter,
        nameLike: wrapLikeCondition(filter.nameLike),
        processDefinitionNameLike: wrapLikeCondition(filter.processDefinitionNameLike),
        withoutDueDate: filter.withoutDueDate,
        createdAfter: filter.createDateAfter,
        createdBefore: filter.createDateBefore,
        minPriority: filter.minPriority,
        maxPriority: filter.maxPriority
    };
};

export const convertToHistoricProcessInstanceFilter = (filter: ProcessInstanceFilterPayload | undefined): HistoricProcessInstanceFilter | undefined => {
    if (!filter) {
        return filter;
    }
    return {
        ...filter,
        processDefinitionNameLike: wrapLikeCondition(filter.processDefinitionNameLike),
        processInstanceBusinessKeyLike: wrapLikeCondition(filter.businessKeyLike)
    }
};

export const convertTaskSort = (taskSort?: SortPayload): CamundaSort[] => {
    if (!taskSort) {
        return [];
    }

    const field = taskSort.property;
    let camundaSortBy;
    switch (field) {
        case "name":
            camundaSortBy = "name";
            break;
        case "dueDate":
            camundaSortBy = "dueDate";
            break;
        case "createDate":
            camundaSortBy = "created";
            break;
        case "priority":
            camundaSortBy = "priority";
            break;
    }
    return [{
        sortBy: camundaSortBy,
        sortOrder: taskSort.order,
    }];
};

export const convertToInputVariablesMap = (data?: unknown): CamundaInputVariablesMap | undefined => {
    if (!data || typeof data !== "object") {
        return undefined;
    }

    const variables: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
        variables[key] = {
            value
        };
    }

    return {
        variables
    }
};

export const convertToUserTaskRequest = (params: GetUserTaskListParams): CamundaUserTaskRequest => {
    const filter = convertToCamundaTaskFilter(params?.filter);

    return {
        ...filter,
        active: true,
        assignee: params?.username,
        sorting: convertTaskSort(params?.sort)
    };
};

export const convertToUserProcessInstanceRequest = (params: GetUserTaskListParams): CamundaHistoricProcessInstanceRequest => {
    const filter = convertToHistoricProcessInstanceFilter(params?.filter);

    return {
        ...filter,
        active: true,
        unfinished: true,
        startedBy: params?.username,
        sorting: convertHistoricInstanceSort(params?.sort)
    };
};

export const convertHistoricInstanceSort = (instanceSort?: SortPayload): CamundaSort[] => {
    if (!instanceSort) {
        return [];
    }

    const field = instanceSort.property;
    let camundaSortBy;
    switch (field) {
        case "startTime":
            camundaSortBy = "startTime";
            break;
        case "processName":
            camundaSortBy = "definitionName";
            break;
    }

    return [{
        sortBy: camundaSortBy,
        sortOrder: instanceSort.order,
    }];
};

export const wrapLikeCondition = (value?: string): string | undefined => {
    if (!value) {
        return value;
    }
    return `%${value}%`;
};

