/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useCustomForms} from "@hooks/useCustomForms.ts";
import type {CustomFormProps} from "@features/custom-forms/types.ts";
import {Alert, Anchor, Space} from "antd";
import {useTranslation} from "react-i18next";

const {Link} = Anchor;

const HELP_LINK = "https://github.com/openbpm-platform/openbpm-tasklist-react?tab=readme-ov-file#custom-forms-support-";

/**
 * A wrapper component to show a custom start or task form registered with the key.
 * If a custom form not found by a form key, null is returned.
 * @param props a custom form props
 * @constructor
 * @see CustomFormConfig
 * @see useCustomForms
 */
export const CustomForm = (props: CustomFormProps) => {
    const {formData} = props;
    const {getForm} = useCustomForms();
    const {t: translate} = useTranslation("common");

    const customForm = getForm(formData.formKey);

    if (!customForm) {
        return <Space direction="vertical" style={{width: "100%"}}>
            <Alert style={{width: "100%"}}
                   description={import.meta.env.DEV ? <Link title={translate("customFormNotConfigured.description")}
                                                            target="_blank"
                                                            href={HELP_LINK}>
                   </Link> : undefined}
                   message={translate("customFormNotConfigured")} type="warning" showIcon/>
        </Space>;
    }

    const FormComponent = customForm.component;
    return (
        <>
            <FormComponent {...props}/>
        </>
    );
};