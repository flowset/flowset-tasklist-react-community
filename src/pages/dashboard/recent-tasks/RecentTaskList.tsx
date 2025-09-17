/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Flex, List, Tooltip, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {CalendarOutlined} from "@ant-design/icons";
import {TaskPriority} from "../../../components/user-task/TaskPriority.tsx";
import {useEffect, useState} from "react";
import {renderDateTime} from "../../../utils/format/renderDateTime.ts";
import {renderRelativeDateTime} from "../../../utils/format/renderRelativeDateTime.ts";
import {useTranslation} from "react-i18next";
import {useListCardStyles} from "../useListCardStyles.ts";
import {createStyles} from "antd-style";
import type { UserTask } from "../../../types/common.ts";

export interface RecentTaskListProps {
    items: UserTask[];
}

const {Text} = Typography;

const useStyles = createStyles(({css, token}) => ({
    descriptionContainer: css`
        width: 100%;
        color: ${token.colorTextTertiary}
    `,
    priorityText: css`
        margin-left: auto;
    `
}));

export const RecentTaskList = ({items}: RecentTaskListProps) => {
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
                                        description={<RecentTaskCard item={item}/>}
                        />
                    </List.Item>
                )}
            />
        </>
    );
};


interface RecentTaskCardProps {
    item?: UserTask
}

const RecentTaskCard = ({item}: RecentTaskCardProps) => {
    const {styles} = useListCardStyles();

    const {styles: recentTasksStyles} = useStyles();
    const navigate = useNavigate();


    if (!item) {
        return null;
    }
    return (
        <>
            <Card className={styles.listItemCard}
                  onClick={() => {
                      navigate(`/tasks?task=${item.id}`);
                  }}>
                <Flex vertical={true} gap={5}>
                    <Text strong><Link to={`/tasks?task=${item.id}`}>{item.name}</Link></Text>
                    <Flex align={"center"}
                          className={recentTasksStyles.descriptionContainer}
                          gap={5}>
                        <CalendarOutlined/>

                        <TaskRelativeCreateDate date={item.createDate}/>

                        <div className={recentTasksStyles.priorityText}>
                            {item.priority && <TaskPriority value={item.priority}/>}
                        </div>
                    </Flex>
                </Flex>
            </Card>
        </>
    );
};

interface TaskRelativeCreateDateProps {
    date?: string
}

const TaskRelativeCreateDate = ({date}: TaskRelativeCreateDateProps) => {
    const [time, setTime] = useState(Date.now());
    const {t} = useTranslation(['dashboard']);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 10 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    const relativeDateTime = renderRelativeDateTime(time, date);
    return <Tooltip
        title={t('recentTasksCard.creationDate', {date: renderDateTime(date)})}>
        <span>{t('recentTasksCard.createdAgo', {relativeDate: relativeDateTime})}</span>
    </Tooltip>
}