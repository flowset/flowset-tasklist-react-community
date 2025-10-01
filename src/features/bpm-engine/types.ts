/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

/**
 * Settings of the BPM engine which the OpenBPM Tasklist connects to.
 */
export interface BpmEngineConfig {
    /**
     * Short name of the BPM engine, e.g. Dev stand.
     */
    name?: string;
    /**
     * A base URL for the BPM engine REST API, e.g. http://localhost:8080/engine-rest.
     */
    apiUrl: string;
    /**
     * A type of the BPM engine.
     */
    type: EngineType;
}

/**
 * The list of supported types of BPM engines.
 */
export enum EngineType {
    CAMUNDA_7 = "CAMUNDA_7",
    OPERATON = "OPERATON",
}


