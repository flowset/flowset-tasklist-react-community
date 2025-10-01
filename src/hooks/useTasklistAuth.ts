/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import { useContext } from "react";
import { TasklistAuthContext } from "@features/auth/TasklistAuthContext.ts";

export const useTasklistAuth = () => {
    const context = useContext(TasklistAuthContext);
    if (!context) {
        throw new Error("useTasklistAuth must be used within an TasklistAuthProvider");
    }
    return context;
};