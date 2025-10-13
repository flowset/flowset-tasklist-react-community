/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Col, DatePicker, Form, type FormItemProps} from "antd";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

export const StartTimeFilterRangePicker = (props: Omit<FormItemProps, "name" | "label">) => {
    const {t: translate} = useTranslation(["processInstance"]);
    return (
        <>
            <Col xs={24} sm={12} xl={6}>
                <Form.Item name="startTimePeriod" label={translate("processInstance:startTime")} {...props}>
                    <DatePicker.RangePicker
                        format={translate("common:dateFormat")}
                        disabledDate={current => current && current > dayjs().endOf("day")}
                        presets={[
                            {label: translate("common:datePeriod.today"), value: [dayjs(), dayjs()]},
                            {
                                label: translate("common:lastDatePeriod_few", {days: 3}),
                                value: [dayjs().add(-3, "d"), dayjs()]
                            },
                            {
                                label: translate("common:lastDatePeriod", {days: 7}),
                                value: [dayjs().add(-7, "d"), dayjs()]
                            },
                            {
                                label: translate("common:lastDatePeriod", {days: 14}),
                                value: [dayjs().add(-14, "d"), dayjs()]
                            },
                        ]}
                    />
                </Form.Item>
            </Col>
        </>
    );
};