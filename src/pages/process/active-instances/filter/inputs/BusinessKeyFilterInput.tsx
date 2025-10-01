/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Col, Form, type FormItemProps, Input} from "antd";
import {useTranslation} from "react-i18next";

export const BusinessKeyFilterInput = (props: Omit<FormItemProps, "name" | "label">) => {
    const {t: translate} = useTranslation(["processInstance"]);
    return (
        <>
            <Col xs={24} sm={12} xl={6}>
                <Form.Item name="businessKey" label={translate("processInstance:businessKey")} {...props}>
                    <Input allowClear={true}
                           placeholder={translate("processInstance:listPage.businessKey.placeholder")}/>
                </Form.Item>
            </Col>
        </>
    );
};