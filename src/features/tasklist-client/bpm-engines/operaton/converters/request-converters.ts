/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {SortPayload, TaskFilterPayload} from "../../../../../types/common.ts";
import type {OperatonInputVariablesMap, OperatonSort, OperatonTaskFilter, OperatonUserTaskRequest} from "../types/request.ts";
import type {GetUserTaskListParams} from "../../../types/request.ts";


export const convertToOperatonTaskFilter = (filter: TaskFilterPayload | undefined) => {
    if (!filter) {
        return filter;
    }
    const operatonFilter: OperatonTaskFilter | undefined = {
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

    return operatonFilter;
};

export const convertTaskSort = (taskSort?: SortPayload): OperatonSort[] => {
    if (!taskSort) {
        return [];
    }

    const field = taskSort.property;
    let operatonSortBy;
    switch (field) {
        case "name":
            operatonSortBy = "name";
            break;
        case "dueDate":
            operatonSortBy = "dueDate";
            break;
        case "createDate":
            operatonSortBy = "created";
            break;
        case "priority":
            operatonSortBy = "priority";
            break;
    }
    return [{
        sortBy: operatonSortBy,
        sortOrder: taskSort.order,
    }];
};

export const convertToInputVariablesMap = (data?: unknown): OperatonInputVariablesMap | undefined => {
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
        variables: variables,
    }
}

export const convertToUserTaskRequest = (params: GetUserTaskListParams): OperatonUserTaskRequest => {
    const filter = convertToOperatonTaskFilter(params?.filter);

    return {
        ...filter,
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

