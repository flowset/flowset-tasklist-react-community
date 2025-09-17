/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {SortPayload, TaskFilterPayload} from "../../../../../types/common.ts";
import type {CamundaSort, CamundaTaskFilter, CamundaInputVariablesMap, CamundaUserTaskRequest} from "../types/request.ts";
import type {GetUserTaskListParams} from "../../../types/request.ts";


export const convertToCamundaTaskFilter = (filter: TaskFilterPayload | undefined) => {
    if (!filter) {
        return filter;
    }
    const camundaFilter: CamundaTaskFilter | undefined = {
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

    return camundaFilter;
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
    if (!data || typeof data !== 'object') {
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
}

export const convertToUserTaskRequest = (params: GetUserTaskListParams): CamundaUserTaskRequest => {
    const filter = convertToCamundaTaskFilter(params?.filter);

    return {
        ...filter,
        active: true,
        assignee: params?.username,
        sorting: convertTaskSort(params?.sort)
    };
};

export const wrapLikeCondition = (value?: string): string | undefined => {
    if (!value) {
        return value;
    }
    return `%${value}%`;
}

