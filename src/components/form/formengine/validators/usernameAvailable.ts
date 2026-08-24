/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {FormViewerProps} from "@react-form-builder/core";
import {checkUsernameAvailable} from "../api/client.ts";

/**
 * Custom FormEngine validators.
 * `usernameAvailable` calls GET /api/username/check and fails when the name exists.
 */
export const validators: FormViewerProps["validators"] = {
    string: {
        usernameAvailable: {
            validate: async (value) => {
                if (!value || typeof value !== "string") {
                    return true;
                }
                try {
                    const available = await checkUsernameAvailable(value);
                    return available ? true : "This username is already taken";
                } catch {
                    return "Unable to verify username availability";
                }
            },
        },
    },
};
