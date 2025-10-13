/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {OperatonHistoricTaskRequest, OperatonUserTaskRequest} from "../types/request.ts";
import dayjs, {type Dayjs} from "dayjs";
import {formatOffsetDateTime} from "@utils/format";

/**
 * Creates a body of the request to load active tasks assigned to the provided user.
 * @param assignee username
 */
export const createActiveTasksCountRequest = (assignee: string): OperatonUserTaskRequest => {
    return {
        assignee: assignee
    }
};

/**
 * Creates a body of the request to load overdue tasks assigned to the provided user.
 * @param assignee username
 * @param currentDate current date
 */
export const createOverdueTasksCountRequest = (assignee: string, currentDate: Dayjs): OperatonUserTaskRequest => {
    return {
        assignee: assignee,
        dueBefore: formatOffsetDateTime(currentDate)
    }
};

/**
 * Creates a body of the request to load last created tasks assigned to the provided user.
 * @param assignee username
 */
export const createRecentTasksRequest = (assignee: string): OperatonUserTaskRequest => {
    return {
        assignee: assignee,
        sorting: [{sortBy: "created", sortOrder: "desc"}]
    }
};

/**
 * Creates a body of the request to load tasks assigned to the provided user and created in the previous week.
 * @param assignee username
 * @param currentDate current date
 */
export const createWeeklyTasksRequest = (assignee: string, currentDate: Dayjs): OperatonHistoricTaskRequest => {
    const weekAgo = dayjs().subtract(6, "day").startOf("day");

    return {
        taskAssignee: assignee,
        startedAfter: formatOffsetDateTime(weekAgo),
        startedBefore: formatOffsetDateTime(currentDate),
    }
};

/**
 * Creates a body of the request to load tasks assigned to the provided user and created in the previous month.
 * @param assignee username
 * @param currentDate current date
 * @param finished whether loading only finished tasks or all tasks
 */
export const createMonthlyTasksCountRequest = (assignee: string, currentDate: Dayjs, finished?: boolean): OperatonHistoricTaskRequest => {
    const startOfMonth = dayjs().startOf("month");

    return {
        taskAssignee: assignee,
        startedAfter: formatOffsetDateTime(startOfMonth),
        startedBefore: formatOffsetDateTime(currentDate),
        finished
    }
};
