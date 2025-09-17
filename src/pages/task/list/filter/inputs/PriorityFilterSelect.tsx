/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import Col from "antd/es/grid/col";
import {Flex, Form, type FormItemProps, Select} from "antd";
import {useTaskSelection} from "../../../../../hooks/user-task/useTaskSelection.ts";
import {useTranslation} from "react-i18next";
import {TaskPriority} from "../../../../../components/user-task/TaskPriority.tsx";

export const PriorityFilterSelect = (props: Omit<FormItemProps, "name" | "label">) => {
    const {selectedTaskId: taskId} = useTaskSelection();
    const {t: translate} = useTranslation(["userTask"]);
    return (
        <>
            <Col xs={24} sm={taskId ? 24 : 12} xl={taskId ? 12 : 4}>
                <Form.Item name="priority" label={translate('userTask:priority')} {...props}>
                    <Select allowClear={true}
                            placeholder={translate('userTask:listPage.priorityField.placeholder')}>
                        {["low", "normal", "high"].map(value => <Select.Option value={value} key={value}>
                            <Flex align="center">
                                <TaskPriority value={value}/>
                            </Flex>
                        </Select.Option>)
                        }
                    </Select>

                </Form.Item>
            </Col>
        </>
    );
};