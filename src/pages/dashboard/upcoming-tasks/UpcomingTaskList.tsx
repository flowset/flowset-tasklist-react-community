/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Flex, List, Tooltip, Typography} from "antd";
import dayjs from "dayjs";
import {Link, useNavigate} from "react-router-dom";
import {ClockCircleOutlined} from "@ant-design/icons";
import {renderDateTime} from "../../../utils/format/renderDateTime.ts";
import {TaskPriority} from "../../../components/user-task/TaskPriority.tsx";
import {useEffect, useState} from "react";
import {renderRelativeDateTime} from "../../../utils/format/renderRelativeDateTime.ts";
import {useListCardStyles} from "../useListCardStyles.ts";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";
import type {UserTask} from "../../../types/common.ts";

const {Text} = Typography;

const useStyles = createStyles(({css, token}, isOverdue) => ({
    descriptionContainer: css`
        width: 100%;
        color: ${isOverdue ? token.colorError : token.colorTextTertiary}
    `,
    priorityText: css`
        margin-left: auto;
    `
}));


export interface UpcomingTaskListProps {
    items: UserTask[];
}


export const UpcomingTaskList = ({items}: UpcomingTaskListProps) => {
    const {styles} = useListCardStyles();
    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={items}
                renderItem={(item) => (
                    <List.Item
                        className={styles.listItem}>
                        <List.Item.Meta className={styles.listItemMeta}
                                        description={<UpcomingTaskCard item={item}/>}
                        />
                    </List.Item>
                )}
            />
        </>
    );
};

interface UpcomingTaskCardProps {
    item?: UserTask
}

export const UpcomingTaskCard = ({item}: UpcomingTaskCardProps) => {
    const navigate = useNavigate();
    const {styles} = useListCardStyles();
    const {styles: upcomingTasksStyles} = useStyles();
    const {t: translate} = useTranslation(["dashboard"]);

    if (!item) {
        return null;
    }
    const isOverdue = item.dueDate ? dayjs(item.dueDate).isBefore(dayjs()) : false;
    return (
        <>
            <Card className={styles.listItemCard}
                  onClick={() => {
                      navigate(`/tasks?task=${item.id}`);
                  }}>
                <Flex vertical={true} gap={5}>
                    <Text strong><Link to={`/tasks?task=${item.id}`}>{item.name}</Link></Text>
                    <Flex align={"center"} className={upcomingTasksStyles.descriptionContainer} gap={5}>
                        <ClockCircleOutlined/>
                        {(isOverdue || !item.dueDate) ?
                            <Tooltip
                                title={translate("upcomingTasksCard.dueDate", {date: renderDateTime(item.dueDate, "-")})}>
                                {isOverdue && <span>{translate("upcomingTasksCard.dueDatePassed")}</span>}
                                {!item.dueDate && <span>{translate("upcomingTasksCard.noDueDate")}</span>}
                            </Tooltip> : <TaskRelativeDueDate date={item.dueDate}/>
                        }
                        <div className={upcomingTasksStyles.priorityText}>
                            {item.priority && <TaskPriority value={item.priority}/>}
                        </div>
                    </Flex>
                </Flex>
            </Card>
        </>
    );
};

interface TaskRelativeDueDateProps {
    date: string
}

const TaskRelativeDueDate = ({date}: TaskRelativeDueDateProps) => {
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 10 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return <Tooltip title={`Due date: ${renderDateTime(date, "-")}`}>
        <span>Due in {renderRelativeDateTime(date, time)}</span>
    </Tooltip>
}