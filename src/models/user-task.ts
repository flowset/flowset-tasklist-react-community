import type {ProcessDefinition} from "@models/process.ts";

/**
 * Representation of a user task for the Flowset Tasklist pages.
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
 * Representation of the Dashboard data.
 */
export interface UserTaskStatistics {
    activeTasksCount?: number;
    overdueTasksCount?: number;
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