/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {forwardRef, type ComponentProps} from "react";
import {USE_DEPLOYED_FORM_STUB} from "@features/tasklist-client/stubs/deployed-form-stub.ts";
import {FormJsForm} from "@components/form/form-js/FormJsForm.tsx";
import {FormEngineForm} from "@components/form/formengine/FormEngineForm.tsx";
import type {FormJsFormViewer} from "@components/form/form-js/types/FormJsFormViewer.ts";

type JsonFormProps = ComponentProps<typeof FormJsForm>;

/**
 * Renders FormEngine when `VITE_USE_DEPLOYED_FORM_STUB` is true, otherwise form-js.
 */
export const DeployedJsonForm = forwardRef<FormJsFormViewer, JsonFormProps>((props, ref) => {
    if (USE_DEPLOYED_FORM_STUB) {
        return <FormEngineForm ref={ref} {...props} />;
    }
    return <FormJsForm ref={ref} {...props} />;
});
