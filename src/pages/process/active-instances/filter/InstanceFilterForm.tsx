import type {FormProps} from "antd/lib";
import {useForm} from "antd/es/form/Form";
import {useCallback} from "react";
import {Button, Flex, Form, Row} from "antd";
import {createStyles} from "antd-style";
import {ProcessNameFilterInput} from "./inputs/ProcessNameFilterInput.tsx";
import Col, {type ColProps} from "antd/es/grid/col";
import {StartTimeFilterRangePicker} from "./inputs/StartTimeFilterRangePicker.tsx";
import {useTranslation} from "react-i18next";
import {CloseOutlined, SearchOutlined} from "@ant-design/icons";
import {BusinessKeyFilterInput} from "./inputs/BusinessKeyFilterInput.tsx";
import type {InstanceFilterFormData} from "./types.ts";


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

interface InstanceFilterFormProps {
    onApply: (filters: InstanceFilterFormData) => void,
    onReset: () => void
}

export const InstanceFilterForm = ({onApply, onReset}: InstanceFilterFormProps & FormProps) => {
    const [form] = useForm();

    const {styles} = useStyles();

    const handleClear = useCallback(() => {
        form.resetFields();
        onReset();
    }, [form, onReset]);

    const onFormFinish = (values: InstanceFilterFormData) => {
        onApply(values);
    };

    const labelCol: ColProps = {span: 24, style: {paddingBottom: 0}};
    const wrapperCol: ColProps = {span: 24};
    return (
        <>
            <Form form={form} onFinish={onFormFinish} style={{width: "100%"}}>
                <Row className={styles.gridRow} gutter={[10, 5]}>
                    <ProcessNameFilterInput labelCol={labelCol}
                                            wrapperCol={wrapperCol}
                                            className={styles.formItem}/>
                    <BusinessKeyFilterInput labelCol={labelCol} wrapperCol={wrapperCol} className={styles.formItem}/>
                    <StartTimeFilterRangePicker labelCol={labelCol}
                                                wrapperCol={wrapperCol} className={styles.formItem}/>
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
    const {styles} = useStyles();
    const {t: translate} = useTranslation(["common"]);

    return (
        <Col xs={24} sm={12} md={12} xl={6}>
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