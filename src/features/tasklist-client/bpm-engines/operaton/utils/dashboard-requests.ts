/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    OperatonHistoricTaskRequest,
    OperatonUserTaskRequest
} from "../types/request.ts";
import dayjs, {type Dayjs} from "dayjs";
import {formatOffsetDateTime} from "../../../../../utils/format/formatOffsetDateTime.ts";

export const createActiveTasksCountRequest = (assignee: string): OperatonUserTaskRequest => {
    return {
        assignee: assignee
    }
};

export const createOverdueTasksCountRequest = (assignee: string, currentDate: Dayjs): OperatonUserTaskRequest => {
    return {
        assignee: assignee,
        dueBefore: formatOffsetDateTime(currentDate)
    }
};

export const createUpcomingTasksRequest = (assignee: string, currentDate: Dayjs): OperatonUserTaskRequest => {
    return {
        assignee: assignee,
        dueAfter: formatOffsetDateTime(currentDate),
        sorting: [{sortBy: "dueDate", sortOrder: "asc"}, {sortBy: "priority", sortOrder: "desc"}]
    }
};

export const createRecentTasksRequest = (assignee: string): OperatonUserTaskRequest => {
    return {
        assignee: assignee,
        sorting: [{sortBy: "created", sortOrder: "desc"}]
    }
};

export const createWeeklyTasksRequest = (assignee: string, currentDate: Dayjs): OperatonHistoricTaskRequest => {
    const weekAgo = dayjs().subtract(6, 'day').startOf('day');

    return {
        taskAssignee: assignee,
        startedAfter: formatOffsetDateTime(weekAgo),
        startedBefore: formatOffsetDateTime(currentDate),
    }
};

export const createMonthlyTasksCountRequest = (assignee: string, currentDate: Dayjs, finished?: boolean): OperatonHistoricTaskRequest => {
    const startOfMonth = dayjs().startOf('month');

    return {
        taskAssignee: assignee,
        startedAfter: formatOffsetDateTime(startOfMonth),
        startedBefore: formatOffsetDateTime(currentDate),
        finished
    }
};
