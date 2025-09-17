/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCustomForms} from "../../hooks/useCustomForms.ts";
import type {CustomFormProps} from "../../features/custom-forms/types.ts";
import {Typography} from "antd";
import {useTranslation} from "react-i18next";

const {Text} = Typography;

/**
 * A wrapper component to show a custom start or task form registered with the key.
 * If custom form is not found by form key, null ir returned.
 * @param props a custom form props
 * @constructor
 * @see CustomFormConfig
 * @see useCustomForms
 */
export const CustomForm = (props: CustomFormProps) => {
    const {formData} = props;
    const {getForm} = useCustomForms();
    const {t: translate} = useTranslation("userTask");

    const customForm = getForm(formData.formKey);

    if (!customForm) {
        return <Text>
            {translate("detailPage.customFormNotConfigured")}
        </Text>;
    }

    const FormComponent = customForm.component;
    return (
        <>
            <FormComponent {...props}/>
        </>
    );
};