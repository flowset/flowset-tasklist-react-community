/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useForm} from "antd/es/form/Form";
import {Flex, Form, Row} from "antd";
import {useCallback, useState} from "react";
import Col, {type ColProps} from "antd/es/grid/col";
import Button from "antd/es/button";
import {CloseOutlined, SearchOutlined} from "@ant-design/icons";
import type {FormProps} from "antd/lib";
import type {TaskFilterFormData} from "./types.ts";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";
import {useTaskSelection} from "@hooks/user-task";
import {NameFilterInput} from "./inputs/NameFilterInput.tsx";
import {ProcessFilterInput} from "./inputs/ProcessFilterInput.tsx";
import {PriorityFilterSelect} from "./inputs/PriorityFilterSelect.tsx";
import {CreateDateFilterRangePicker} from "./inputs/CreateDateFilterRangePicker.tsx";
import {DueDateFilterSelect} from "./inputs/DueDateFilterSelect.tsx";
import {DueDateFilterRangePicker} from "./inputs/DueDateFilterRangePicker.tsx";

const useStyles = createStyles(({css}) => ({
    formItem: css`
        margin-bottom: 0;
    `,
    gridRow: css`
        width: 100%;
    `,
    actionsContainer: css`
        width: 100%;
        height: 100%;
    `
}));

interface TaskFilterFormProps {
    onApply: (taskFilters: TaskFilterFormData) => void,
    onReset: () => void
}

export const TaskFilterForm = ({onApply, onReset}: TaskFilterFormProps & FormProps) => {
    const [form] = useForm();
    const [showCustomDueDate, setShowCustomDueDate] = useState<boolean>();
    const {styles} = useStyles();

    const handleClear = useCallback(() => {
        form.resetFields();
        setShowCustomDueDate(false);
        onReset();
    }, [form, onReset]);

    const handleDueDateOptionChange = useCallback((value: string) => setShowCustomDueDate(value === "period"), []);

    const onFormFinish = (values: TaskFilterFormData) => {
        onApply(values);
    };

    const labelCol: ColProps = {span: 24, style: {paddingBottom: 0}};
    const wrapperCol: ColProps = {span: 24};

    return (
        <>
            <Form form={form} onFinish={onFormFinish}>
                <Row className={styles.gridRow} gutter={[10, 5]}>
                    <NameFilterInput labelCol={labelCol}
                                     wrapperCol={wrapperCol}
                                     className={styles.formItem}/>

                    <ProcessFilterInput labelCol={labelCol}
                                        wrapperCol={wrapperCol}
                                        className={styles.formItem}/>

                    <PriorityFilterSelect labelCol={labelCol}
                                          wrapperCol={wrapperCol}
                                          className={styles.formItem}/>
                    <CreateDateFilterRangePicker labelCol={labelCol}
                                                 wrapperCol={wrapperCol}
                                                 className={styles.formItem}/>
                </Row>
                <Row className={styles.gridRow} gutter={[10, 5]}>
                    <DueDateFilterSelect onChange={handleDueDateOptionChange} labelCol={labelCol}
                                         wrapperCol={wrapperCol}
                                         className={styles.formItem}/>
                    <DueDateFilterRangePicker showCustomDueDate={showCustomDueDate} labelCol={labelCol}
                                              wrapperCol={wrapperCol}
                                              className={styles.formItem}/>

                    <FilterActions onClear={handleClear}/>
                </Row>
            </Form>
        </>
    );
};

interface FilterActionsProps {
    onClear: () => void;
}

const FilterActions = ({onClear}: FilterActionsProps) => {
    const {selectedTaskId: taskId} = useTaskSelection();
    const {styles} = useStyles();
    const {t: translate} = useTranslation(["common", "userTask"]);

    return (
        <Col xs={24} sm={24} md={24} xl={taskId ? 24 : 13}>
            <Flex align="end" justify="end" gap={10} className={styles.actionsContainer}>
                <Form.Item className={styles.formItem}>
                    <Button htmlType="button" onClick={onClear}
                            icon={<CloseOutlined/>}>{translate("common:actions.clear")}</Button>
                </Form.Item>
                <Form.Item className={styles.formItem}>
                    <Button type="primary" htmlType="submit"
                            icon={<SearchOutlined/>}>{translate("common:actions.apply")}</Button>
                </Form.Item>
            </Flex>
        </Col>
    );
};