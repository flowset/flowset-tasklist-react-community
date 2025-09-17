/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {
    CamundaCountDto,
    CamundaFormData,
    CamundaFormRef,
    CamundaHistoricTask,
    CamundaProcessDefinition,
    CamundaProcessInstance,
    CamundaTask,
    CamundaVariablesMap
} from "../../camunda/types/response.ts";


export type OperatonCountDto = CamundaCountDto;
export type OperatonProcessDefinition = CamundaProcessDefinition;
export type OperatonHistoricTask = CamundaHistoricTask;
export type OperatonVariablesMap = CamundaVariablesMap;
export type OperatonFormRef = CamundaFormRef;
export type OperatonProcessInstance = CamundaProcessInstance;

export interface OperatonTask extends Omit<CamundaTask, "camundaFormRef"> {
    operatonFormRef?: OperatonFormRef;
}

export interface OperatonFormData extends Omit<CamundaFormData, "camundaFormRef"> {
    operatonFormRef?: OperatonFormRef;
}