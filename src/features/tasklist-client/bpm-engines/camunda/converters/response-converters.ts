/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {TaskExecutionDateStatistics, TaskExecutionPeriodStatistics, UserTask} from "@models/user-task";
import type {
    CamundaCountDto,
    CamundaFormData,
    CamundaHistoricProcessInstance,
    CamundaHistoricTask,
    CamundaProcessDefinition,
    CamundaTask,
    CamundaVariablesMap
} from "../types/response";

import dayjs from "dayjs";
import type {ProcessDefinition, UserProcessInstance} from "@models/process.ts";
import {FormType, type InitialData, type ProcessFormData} from "@models/form";

/**
 * Converts Camunda count DTO to a numeric value
 * @param value - CamundaCountDto or unknown value to convert
 * @returns numeric count value, defaults to 0 if invalid
 */
export const convertCountDtoToCount = (value?: CamundaCountDto | unknown): number => {
    const countDto = value as CamundaCountDto;
    if (!countDto || countDto.count === undefined) {
        return 0;
    }
    return countDto.count;
};

/**
 * Converts an array of Camunda user tasks to an array of UserTask objects
 * @param camundaTasks
 * @see UserTask
 */
export const convertUserTasks = (camundaTasks?: CamundaTask[]): UserTask[] => {
    if (!camundaTasks) {
        return [];
    }
    return camundaTasks.map<UserTask>(value => convertUserTask(value));
};

export const convertUserTask = (task: CamundaTask): UserTask => {
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

/**
 * Converts an array of Camunda historic process instances to an array of UserProcessInstance objects
 * @param instances an array of process instances loaded from Camunda
 * @returns an array of UserProcessInstance instances with relevant properties
 * @see UserProcessInstance
 */
export const convertProcessInstances = (instances?: CamundaHistoricProcessInstance[]): UserProcessInstance[] => {
    if (!instances) {
        return [];
    }
    return instances.map<UserProcessInstance>(value => convertProcessInstance(value));
};


/**
 * Converts a Camunda historic process instance into a UserProcessInstance instance object.
 *
 * @param {CamundaHistoricProcessInstance} instance - The Camunda historic process instance to be converted.
 * @returns {UserProcessInstance} the converted user process instance object with relevant properties.
 */
export const convertProcessInstance = (instance: CamundaHistoricProcessInstance): UserProcessInstance => {
    return {
        startTime: instance.startTime,
        processDefinitionName: instance.processDefinitionName,
        id: instance.id,
        state: instance.state,
        businessKey: instance.businessKey
    }
};

export const convertEnrichUserTask = (task: UserTask, processDefinitions?: CamundaProcessDefinition[]) => {
    const camundaProcessDefinition = task.processDefinition?.id ?
        processDefinitions?.find(value => value.id === task.processDefinition?.id) : undefined;

    if (!camundaProcessDefinition) {
        return task;
    }
    return ({
        ...task,
        processDefinition: convertProcessDefinition(camundaProcessDefinition)
    });
};


export const convertProcessDefinitions = (processDefinitions?: CamundaProcessDefinition[]): ProcessDefinition[] => {
    if (!processDefinitions) {
        return [];
    }

    return processDefinitions.map<ProcessDefinition>(value => convertProcessDefinition(value));
};


export const convertProcessDefinition = (processDefinition: CamundaProcessDefinition): ProcessDefinition => {
    return {
        id: processDefinition.id,
        key: processDefinition.key,
        description: processDefinition.description,
        version: processDefinition.version,
        name: processDefinition.name,
        versionTag: processDefinition.versionTag
    }
};

export const convertCamundaFormToProcessForm = (camundaForm: CamundaFormData): ProcessFormData | null => {
    const formKey = camundaForm.key;
    const formRef = camundaForm.camundaFormRef;
    const baseForm: ProcessFormData = {
        formKey: formKey || formRef?.key,
        version: formRef?.version,
        type: FormType.CUSTOM
    };
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
};

export const convertContentTypeToFormType = (contentType?: string | null): FormType => {
    if (contentType === "application/json") {
        return FormType.FORM_ENGINE_JSON;
    }

    if (contentType === "application/xhtml+xml") {
        return FormType.HTML;
    }

    return FormType.CUSTOM;
};

export const convertVariablesMap = (variablesMap: CamundaVariablesMap): InitialData => {
    const initialData: InitialData = {};
    Object.entries(variablesMap)
        .forEach(([key, camundaVariable]) => {
            initialData[key] = camundaVariable?.value;
        });
    return initialData;
};

export const convertHistoricTasksToStatistics = (tasks?: CamundaHistoricTask[]): TaskExecutionPeriodStatistics => {
    const createdTasks: Map<string, number> = groupTasksByDate(tasks || [], task => task.startTime);
    const completedTasks: Map<string, number> = groupTasksByDate(tasks || [], task => task.endTime);

    const items: TaskExecutionDateStatistics[] = [];
    const lastDate = new Date();
    lastDate.setDate(lastDate.getDate() - 6);

    for (let i = 0; i < 7; i++) {
        const dateKey = lastDate.toISOString().split("T")[0];
        const item: TaskExecutionDateStatistics = {
            date: dayjs(lastDate).format("YYYY-MM-DD"),
            totalTasks: createdTasks.get(dateKey) || 0,
            completedTasksCount: completedTasks.get(dateKey) || 0
        };

        items.push(item);
        lastDate.setDate(lastDate.getDate() + 1);
    }

    const totalTasks = Array.from(createdTasks.values()).reduce((sum, count) => sum + count, 0);
    const completedTasksCount = Array.from(completedTasks.values()).reduce((sum, count) => sum + count, 0);


    return {
        items,
        totalTasks,
        completedTasksCount,
    };
};

const groupTasksByDate = (tasks: CamundaHistoricTask[],
                          getDate: (task: CamundaHistoricTask) => string | null | undefined): Map<string, number> => {
    const map = new Map<string, number>();

    tasks.forEach(item => {
        const dateString = getDate(item);
        if (dateString) {
            const dateKey = dateString.split("T")[0];
            const count = map.get(dateKey) || 0;
            map.set(dateKey, count + 1);
        }
    });

    return map;
};
