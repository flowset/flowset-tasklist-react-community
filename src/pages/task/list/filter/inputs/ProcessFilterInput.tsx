/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Col, Form, type FormItemProps, Input} from "antd";
import {useTaskSelection} from "@hooks/user-task";
import {useTranslation} from "react-i18next";

export const ProcessFilterInput = (props: Omit<FormItemProps, "name" | "label">) => {
    const {selectedTaskId: taskId} = useTaskSelection();
    const {t: translate} = useTranslation(["userTask"]);
    return (
        <>
            <Col xs={24} sm={taskId ? 24 : 12} xl={taskId ? 12 : 7}>
                <Form.Item name="process" label={translate("userTask:processDefinition")} {...props}>
                    <Input allowClear={true}
                           placeholder={translate("userTask:listPage.processField.placeholder")}/>
                </Form.Item>
            </Col>
        </>
    );
};