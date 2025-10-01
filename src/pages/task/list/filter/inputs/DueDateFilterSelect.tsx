/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Col, Form, type FormItemProps, Select} from "antd";
import {useTaskSelection} from "@hooks/user-task";
import {useTranslation} from "react-i18next";

export const DueDateFilterSelect = (props: Omit<FormItemProps, "name" | "label"> & {
    onChange: (value: string) => void;
}) => {
    const {onChange, ...restProps} = props;
    const {selectedTaskId: taskId} = useTaskSelection();
    const {t: translate} = useTranslation(["userTask"]);
    return (
        <>
            <Col xs={24} sm={taskId ? 24 : 12} xl={taskId ? 7 : 5}>
                <Form.Item name="dueDate" label={translate("userTask:dueDate")} {...restProps}>
                    <Select placeholder={translate("userTask:listPage.dueDateField.placeholder")}
                            onChange={onChange} allowClear={true}>
                        {["overdue", "today", "period", "noDueDate"]
                            .map(value =>
                                <Select.Option
                                    value={value}>
                                    {translate(`userTask:listPage.dueDateField.options.${value}`)}
                                </Select.Option>)}
                    </Select>
                </Form.Item>
            </Col>
        </>
    );
};