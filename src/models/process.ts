/**
 * Representation of a process for the Flowset Tasklist pages.
 */
export interface ProcessDefinition {
    id: string;
    name?: string;
    version?: number;
    description?: string;
    key?: string;
    versionTag?: string;
}

/**
 * Representation of a process instance for the Flowset Tasklist pages.
 */
export interface ProcessInstance {
    id: string;
    processDefinitionId: string;
    businessKey?: string;
}

/**
 * Representation of a process instance created by the current user.
 */
export interface UserProcessInstance {
    id: string;
    processDefinitionName?: string;
    businessKey?: string;
    startTime?: string;
    state?: string;
}

export interface ProcessFilterPayload {
    nameOrKeyOrDescriptionLike?: string;
}

export interface ProcessInstanceFilterPayload {
    processDefinitionNameLike? : string;
    unfinished?: boolean;
    startedAfter?: string;
    startedBefore?: string;
    active?: boolean;
    businessKeyLike?: string;
}