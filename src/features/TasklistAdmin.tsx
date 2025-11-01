/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ReactNode} from "react";
import {TasklistAuthProvider} from "./auth/TasklistAuthProvider.tsx";
import type {TasklistAuthConfig} from "./auth/types.ts";
import {TasklistClientProvider} from "./tasklist-client/context/TasklistClientProvider.tsx";
import type {CustomFormConfig} from "./custom-forms/types.ts";
import type {ITasklistClient} from "./tasklist-client/types/client.ts";
import type {BpmEngineConfig} from "./bpm-engine/types.ts";
import {BpmEngineProvider} from "./bpm-engine/context/BpmEngineProvider.tsx";
import {CustomFormsProvider} from "./custom-forms/context/CustomFormsProvider.tsx";

export interface TasklistAdminProps {
    /**
     * Child components to be wrapped by providers
     */
    children: ReactNode;

    /**
     * BPM engine configuration for the Flowset Tasklist.
     * <p/>
     * <strong>Note: </strong>If custom backend is used instead of supported BPM engine REST API, then it is required
     * to provide a value for the <code>client</code> prop.
     */
    engine?: BpmEngineConfig;
    /**
     * Authentication configuration for the Flowset Tasklist
     */
    authConfig?: TasklistAuthConfig;
    /**
     * Flowset Tasklist client instance for data operations. Required if a default implementation for BPM engine is not used.
     */
    client?: ITasklistClient;
    /**
     * Custom forms configuration for user task or start form rendering
     */
    customForms?: CustomFormConfig[];
}

/**
 * Root component that provides all necessary context providers for the Flowset Tasklist application.
 * Wraps the application with all necessary providers (BPM engine, authentication, client, and custom forms).
 *
 * @param props properties including engine configuration and provider settings
 * @returns wrapped application with all context providers
 *
 * @see BpmEngineProvider
 * @see TasklistAuthProvider
 * @see TasklistClientProvider
 * @see CustomFormsProvider
 */
export const TasklistAdmin = ({
                                  children,
                                  engine,
                                  authConfig,
                                  client,
                                  customForms
                              }: TasklistAdminProps) => {

    if (!engine && !client) {
        throw new Error("BPM engine connection or Tasklist client should be passed as prop");
    }
    return (
        <>
            <BpmEngineProvider engine={engine}>
                <TasklistAuthProvider config={authConfig}>
                    <TasklistClientProvider client={client}>
                        <CustomFormsProvider customForms={customForms}>
                            {children}
                        </CustomFormsProvider>
                    </TasklistClientProvider>
                </TasklistAuthProvider>
            </BpmEngineProvider>
        </>
    );
};