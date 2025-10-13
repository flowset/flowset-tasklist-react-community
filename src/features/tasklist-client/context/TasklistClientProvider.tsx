/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {PropsWithChildren} from "react";
import {TasklistClientContext} from "./TasklistClientContext.ts";
import {useBpmEngine} from "@hooks/useBpmEngine.ts";
import {useTasklistAuth} from "@hooks/useTasklistAuth.ts";
import {EngineType} from "@features/bpm-engine/types.ts";
import {CamundaPlatformClient} from "../bpm-engines/camunda/CamundaPlatformClient.ts";
import type {ITasklistClient} from "../types/client.ts";
import {OperatonClient} from "../bpm-engines/operaton/OperatonClient.ts";
import {getEngineBaseUrl} from "@utils/bpm-engine/getEngineBaseUrl.ts";

export type TasklistClientProvider = (authHeaders?: Record<string, string>) => ITasklistClient;

export interface TasklistClientProviderProps {
    client?: ITasklistClient | TasklistClientProvider;
}

export const TasklistClientProvider = ({
                                           client: callTimeClient,
                                           children
                                       }: TasklistClientProviderProps & PropsWithChildren) => {
    const bpmEngine = useBpmEngine();
    const {getAuthHeaders} = useTasklistAuth();

    if (callTimeClient) {
        const tasklistClient = typeof callTimeClient === "function" ? callTimeClient(getAuthHeaders()) : callTimeClient;

        return <TasklistClientContext.Provider value={tasklistClient}>
            {children}
        </TasklistClientContext.Provider>
    }

    const selectedEngine = bpmEngine?.selectedEngine;
    if (!selectedEngine) {
        throw new Error("Cannot create OpenBPM Tasklist client because BPM engine is not configured");
    }

    const engineType = selectedEngine.type;
    let client: ITasklistClient | undefined;

    const engineUrl = getEngineBaseUrl(selectedEngine);

    switch (engineType) {
        case EngineType.CAMUNDA_7:
            client = new CamundaPlatformClient({
                apiUrl: engineUrl,
                headers: getAuthHeaders
            });
            break;

        case EngineType.OPERATON:
            client = new OperatonClient({
                apiUrl: engineUrl,
                headers: getAuthHeaders
            });
            break;
    }

    if (!client) {
        throw new Error("ITasklistClient is not created in the context or not passed as params");
    }

    return (
        <>
            <TasklistClientContext.Provider value={client}>
                {children}
            </TasklistClientContext.Provider>
        </>
    );
};