/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {DescriptionsItemType} from "antd/es/descriptions";
import {Card, type CardProps, Descriptions, Space, Tag, Typography} from "antd";
import {TaskDueDate} from "@components/user-task/TaskDueDate.tsx";
import {getProcessDefinitionRecordRepresentation} from "@utils/record-representation";
import {TaskPriority} from "@components/user-task/TaskPriority.tsx";
import {renderDateTime} from "@utils/format";
import {useTranslation} from "react-i18next";
import type {UserTask} from "@models/user-task.ts";


export interface TaskSystemInfoCardProps {
    task?: UserTask;
}

const {Text} = Typography;

export const TaskSystemInfoCard = (props: TaskSystemInfoCardProps & CardProps) => {
    const {task, ...rest} = props;

    const {t: translate} = useTranslation(["userTask"]);

    const items: DescriptionsItemType[] = [
        {
            label: translate("name"),
            children: task?.name,
            span: 2,
        },
        {
            label: translate("processDefinition"),
            children: getProcessDefinitionRecordRepresentation(task?.processDefinition),
            span: 2,
        },
        {
            label: translate("createDate"),
            children: renderDateTime(task?.createDate, "-"),
            span: 2,
        },
        {
            label: translate("dueDate"),
            children: <TaskDueDate value={task?.dueDate} emptyString="-"/>,
            span: 2,
        },
        {
            label: translate("assignee"),
            children: <Tag color="processing">
                {task?.assignee}
            </Tag>,
            span: {xs: 2, sm: 2, md: 2, xl: 2, xxl: 1},
        },
        {
            label: translate("priority"),
            children: <TaskPriority value={task?.priority || 0}/>,
            span: {xs: 2, sm: 2, md: 2, xl: 2, xxl: 1},
        }
    ];


    return (
        <>
            <Space direction="vertical">
                <Card  {...rest} title={translate("detailPage.taskInformation")} variant={"outlined"}>
                    <Descriptions items={items} column={2}/>
                </Card>
                <Card title={translate("description")} {...rest} variant={"outlined"}>
                    {task?.description ? <Text>{task.description}</Text>
                        : <Text type="secondary">{translate("detailPage.noTaskDescription")}</Text>}
                </Card>
            </Space>

        </>
    );
};