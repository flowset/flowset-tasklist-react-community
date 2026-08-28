/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {forwardRef, type ComponentProps} from "react";
import {FormEngineForm} from "@components/form/formengine/FormEngineForm.tsx";
import type {FormViewerHandle} from "@components/form/formengine/types/FormViewerHandle.ts";

type JsonFormProps = ComponentProps<typeof FormEngineForm>;

/**
 * Renders a JSON form schema loaded from the BPM engine deployment via FormEngine.
 */
export const DeployedJsonForm = forwardRef<FormViewerHandle, JsonFormProps>((props, ref) => {
    return <FormEngineForm ref={ref} {...props} />;
});
