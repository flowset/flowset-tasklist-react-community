/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Representation of process version in Camunda
 */
export interface CamundaProcessDefinition {
    id: string;
    key: string;
    category: string;
    description: string;
    name: string;
    version: number;
    resource: string;
    deploymentId: string;
    diagram: string;
    suspended: boolean;
    tenantId: string;
    versionTag: string;
    historyTimeToLive: number;
    startableInTasklist: boolean;
}

/**
 * Representation of active user task in Camunda
 */
export interface CamundaTask {
    processInstanceId: string;
    processDefinitionId: string;
    taskDefinitionKey: string;
    description?: string | null;
    assignee?: string;
    id: string;
    name?: string;
    due?: string;
    followUp?: string;
    lastUpdated?: string;
    priority?: number;
    formKey?: string;
    created: string;
    camundaFormRef?: CamundaFormRef;
}

/**
 * Response format of count request to Camunda
 */
export interface CamundaCountDto {
    count?: number;
}


export interface CamundaFormData {
    key?: string;
    camundaFormRef?: CamundaFormRef;
}

export interface CamundaFormRef {
    key: string;
    binding?: string;
    version?: number;
}

/**
 * Representation of historic user task in Camunda
 */
export interface CamundaHistoricTask {
    id: string;
    startTime: string;
    endTime?: string | null;
}

export interface CamundaVariablesMap {
    [key: string]: CamundaVariableData;
}

export interface CamundaVariableData {
    type: string;
    value?: unknown;
}

export interface CamundaProcessInstance {
    id: string;
    processDefinitionId: string;
    businessKey?: string
}