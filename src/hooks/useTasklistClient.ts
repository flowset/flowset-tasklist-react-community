/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useContext} from "react";
import {TasklistClientContext} from "../features/tasklist-client/context/TasklistClientContext.ts";
import type {ITasklistClient} from "../features/tasklist-client/types/client.ts";

/**
 * Hook to get an instance of {@link ITasklistClient} from the provided options or configured {@link TasklistClientContext}.
 */
export const useTasklistClient = (): ITasklistClient => {
    const client = useContext(TasklistClientContext);

    if (!client) {
        throw new Error("ITasklistClient is not configured in the context or not passed as params");
    }

    return client!!;
}