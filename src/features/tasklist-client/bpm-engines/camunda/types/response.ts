/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Representation of a process version in Camunda
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
 * Representation of an active user task in Camunda
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
 * Representation of a historic process instance in Camunda
 */
export interface CamundaHistoricProcessInstance {
    id: string;
    processDefinitionId: string;
    processDefinitionKey: string;
    processDefinitionName: string;
    processDefinitionVersion: string;
    businessKey?: string;
    startTime: string;
    endTime?: string;
    startUserId?: string;
    state?: string;
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
 * Deployment resource metadata from GET /deployment/{id}/resources.
 * FormEngine schemas are shipped as {@code .json} (not Camunda Forms {@code .form}).
 */
export interface CamundaDeploymentResource {
    id: string;
    name: string;
    deploymentId: string;
}

/**
 * Representation of a historic user task in Camunda
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