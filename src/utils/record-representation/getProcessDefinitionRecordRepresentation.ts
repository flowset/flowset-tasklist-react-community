/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ProcessDefinition} from "@models/process.ts";

export const getProcessDefinitionRecordRepresentation = (processDefinition?: ProcessDefinition) => {
    if (!processDefinition) {
        return undefined;
    }

    return processDefinition.name || processDefinition.key;
};