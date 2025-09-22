/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {CamundaHistoricTaskRequest, CamundaUserTaskRequest} from "../types/request.ts";
import dayjs, {type Dayjs} from "dayjs";
import {formatOffsetDateTime} from "../../../../../utils/format/formatOffsetDateTime.ts";

/**
 * Creates request to load count of active user tasks from the Camunda.
 * @param assignee task assignee
 */
export const createActiveTasksCountRequest = (assignee: string): CamundaUserTaskRequest => {
    return {
        assignee: assignee
    }
};

/**
 * Creates request to load count of overdue user tasks from the Camunda.
 * @param assignee task assignee
 * @param currentDate current date
 */
export const createOverdueTasksCountRequest = (assignee: string, currentDate: Dayjs): CamundaUserTaskRequest => {
    return {
        assignee: assignee,
        dueBefore: formatOffsetDateTime(currentDate)
    }
};

/**
 * Creates a request to load a list of user tasks with the nearest due date from the Camunda.
 * @param assignee task assignee
 * @param currentDate current date
 */
export const createUpcomingTasksRequest = (assignee: string, currentDate: Dayjs): CamundaUserTaskRequest => {
    return {
        assignee: assignee,
        dueAfter: formatOffsetDateTime(currentDate),
        sorting: [{sortBy: "dueDate", sortOrder: "asc"}, {sortBy: "priority", sortOrder: "desc"}]
    }
};

/**
 * Creates request to load a list tasks of last created user tasks from the Camunda.
 * @param assignee task assignee
 */
export const createRecentTasksRequest = (assignee: string): CamundaUserTaskRequest => {
    return {
        assignee: assignee,
        sorting: [{sortBy: "created", sortOrder: "desc"}]
    }
};

/**
 * Creates request to load a list tasks of user tasks created in the last week from the Camunda.
 * @param assignee task assignee
 * @param currentDate current date
 */
export const createWeeklyTasksRequest = (assignee: string, currentDate: Dayjs): CamundaHistoricTaskRequest => {
    const weekAgo = dayjs().subtract(6, "day").startOf("day");

    return {
        taskAssignee: assignee,
        startedAfter: formatOffsetDateTime(weekAgo),
        startedBefore: formatOffsetDateTime(currentDate),
    }
};

/**
 * Creates request to load a count of user tasks created in the current month from the Camunda.
 * @param assignee task assignee
 * @param currentDate current date
 * @param finished consider task is completed or not
 */
export const createMonthlyTasksCountRequest = (assignee: string, currentDate: Dayjs, finished?: boolean): CamundaHistoricTaskRequest => {
    const startOfMonth = dayjs().startOf("month");

    return {
        taskAssignee: assignee,
        startedAfter: formatOffsetDateTime(startOfMonth),
        startedBefore: formatOffsetDateTime(currentDate),
        finished
    }
};
