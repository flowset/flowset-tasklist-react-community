/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import Col from "antd/es/grid/col";
import {DatePicker, Flex, Form, type FormItemProps} from "antd";
import {useTaskSelection} from "../../../../../hooks/user-task/useTaskSelection.ts";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

export const DueDateFilterRangePicker = (props: Omit<FormItemProps, "name" | "label"> & {
    showCustomDueDate: boolean | undefined;
}) => {
    const {selectedTaskId: taskId} = useTaskSelection();
    const {t: translate} = useTranslation(["userTask"]);
    const {showCustomDueDate, ...restProps} = props
    return (
        <>
            <Col xs={24} sm={taskId ? 24 : 12} xl={taskId ? 10 : 6}>
                {showCustomDueDate && <Flex>
                    <Form.Item name="dueDatePeriod" label={translate('userTask:listPage.dueDatePeriod.label')} {...restProps}
                               rules={[{
                                   required: showCustomDueDate,
                                   message: translate('userTask:listPage.dueDatePeriod.validation.required')
                               }]}>
                        <DatePicker.RangePicker
                            format={translate('common:dateFormat')}
                            disabled={!showCustomDueDate}
                            presets={[
                                {
                                    label: translate('common:nextDatePeriod_few', {days: 3}),
                                    value: [dayjs(), dayjs().add(3, "d")]
                                },
                                {
                                    label: translate('common:nextDatePeriod', {days: 7}),
                                    value: [dayjs(), dayjs().add(7, "d")]
                                },
                                {
                                    label: translate('common:nextDatePeriod', {days: 14}),
                                    value: [dayjs(), dayjs().add(14, "d"),]
                                },
                                {
                                    label: translate('common:nextDatePeriod', {days: 30}),
                                    value: [dayjs(), dayjs().add(30, "d"),]
                                },
                            ]}
                        />
                    </Form.Item>
                </Flex>}
            </Col>
        </>
    );
};