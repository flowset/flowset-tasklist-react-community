/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {view as muiView} from "@react-form-builder/components-material-ui";
import {autoComplete} from "../custom/autoCompleteComponent.ts";

/** Material UI components plus the custom Ant Design AutoComplete. */
export const customView = muiView;
customView.define(autoComplete.model);
