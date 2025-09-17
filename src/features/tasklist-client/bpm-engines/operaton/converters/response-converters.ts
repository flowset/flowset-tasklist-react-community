/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    OperatonCountDto,
    OperatonFormData,
    OperatonHistoricTask,
    OperatonProcessDefinition,
    OperatonTask,
    OperatonVariablesMap
} from "../types/response";
import {
    FormType,
    type InitialData,
    type ProcessDefinition,
    type ProcessFormData, type TaskExecutionDateStatistics, type TaskExecutionPeriodStatistics,
    type UserTask
} from "../../../../../types/common.ts";

import dayjs from "dayjs";

export const convertCountDtoToCount = (value?: OperatonCountDto | unknown): number => {
    const countDto = value as OperatonCountDto;
    if (!countDto || countDto.count === undefined) {
        return 0;
    }
    return countDto.count;
}

export const convertUserTasks = (operatonTasks?: OperatonTask[]): UserTask[] => {
    if (!operatonTasks) {
        return [];
    }
    return operatonTasks.map<UserTask>(value => convertUserTask(value));
};

export const convertUserTask = (task: OperatonTask): UserTask => {
    return {
        id: task.id,
        createDate: task.created,
        assignee: task.assignee,
        dueDate: task.due,
        description: task.description,
        priority: task.priority,
        name: task.name,
        taskDefinitionKey: task.taskDefinitionKey,
        processInstanceId: task.processInstanceId,
        processDefinition: {
            id: task.processDefinitionId
        }
    }
};

export const convertEnrichUserTask = (task: UserTask, processDefinitions?: OperatonProcessDefinition[]) => {
    const operatonProcessDefinition = task.processDefinition?.id ?
        processDefinitions?.find(value => value.id === task.processDefinition?.id) : undefined;

    if (!operatonProcessDefinition) {
        return task;
    }
    return ({
        ...task,
        processDefinition: convertProcessDefinition(operatonProcessDefinition)
    });
};


export const convertProcessDefinitions = (processDefinitions?: OperatonProcessDefinition[]): ProcessDefinition[] => {
    if (!processDefinitions) {
        return [];
    }

    return processDefinitions.map<ProcessDefinition>(value => convertProcessDefinition(value));
};


export const convertProcessDefinition = (processDefinition: OperatonProcessDefinition): ProcessDefinition => {
    return {
        id: processDefinition.id,
        key: processDefinition.key,
        version: processDefinition.version,
        name: processDefinition.name,
        versionTag: processDefinition.versionTag
    }
};

export const convertOperatonFormToProcessForm = (operatonForm: OperatonFormData): ProcessFormData | null => {
    const formKey = operatonForm.key;
    const formRef = operatonForm.operatonFormRef;
    const baseForm: ProcessFormData = {
        formKey: formKey || formRef?.key,
        version: formRef?.version,
        type: FormType.CUSTOM
    }
    if (!formKey && !formRef) {
        return null;
    }
    if (formKey && formKey.startsWith("embedded:")) {
        return {
            ...baseForm,
            type: FormType.EMBEDDED
        }
    }

    return baseForm;
}

export const convertContentTypeToFormType = (contentType?: string | null): FormType => {
    if (contentType === 'application/json') {
        return FormType.FORM_JS_JSON;
    }

    if (contentType === 'application/xhtml+xml') {
        return FormType.HTML;
    }

    return FormType.CUSTOM;
}

export const convertVariablesMap = (variablesMap: OperatonVariablesMap): InitialData => {
    const initialData: InitialData = {};
    Object.entries(variablesMap)
        .forEach(([key, operatonVariable]) => {
            initialData[key] = operatonVariable?.value;
        });
    return initialData;
}

export const convertHistoricTasksToStatistics = (tasks?: OperatonHistoricTask[]): TaskExecutionPeriodStatistics => {
    const createdTasks: Map<string, number> = groupTasksByDate(tasks || [], task => task.startTime);
    const completedTasks: Map<string, number> = groupTasksByDate(tasks || [], task => task.endTime);

    const items: TaskExecutionDateStatistics[] = [];
    let lastDate = new Date();
    lastDate.setDate(lastDate.getDate() - 6);

    for (let i = 0; i < 7; i++) {
        const dateKey = lastDate.toISOString().split('T')[0];
        const item: TaskExecutionDateStatistics = {
            date: dayjs(lastDate).format('YYYY-MM-DD'),
            totalTasks: createdTasks.get(dateKey) || 0,
            completedTasksCount: completedTasks.get(dateKey) || 0
        }

        items.push(item);
        lastDate.setDate(lastDate.getDate() + 1);
    }

    const totalTasks = Array.from(createdTasks.values()).reduce((sum, count) => sum + count, 0);
    const completedTasksCount = Array.from(completedTasks.values()).reduce((sum, count) => sum + count, 0);


    const result: TaskExecutionPeriodStatistics = {
        items,
        totalTasks,
        completedTasksCount,
    }

    return result;
}

const groupTasksByDate = (tasks: OperatonHistoricTask[],
                          getDate: (task: OperatonHistoricTask) => string | null | undefined): Map<string, number> => {
    const map = new Map<string, number>();

    tasks.forEach(item => {
        const dateString = getDate(item);
        if (dateString) {
            const dateKey = dateString.split('T')[0];
            const count = map.get(dateKey) || 0;
            map.set(dateKey, count + 1);
        }
    });

    return map;
}
