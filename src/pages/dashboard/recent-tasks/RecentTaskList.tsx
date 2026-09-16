/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Flex, Listy, Tooltip, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {CalendarOutlined} from "@ant-design/icons";
import {TaskPriority} from "@components/user-task/TaskPriority.tsx";
import {useEffect, useState} from "react";
import {renderDateTime, renderRelativeDateTime} from "@utils/format";
import {useTranslation} from "react-i18next";
import {useListCardStyles} from "../useListCardStyles.ts";
import {createStyles} from "antd-style";
import type {UserTask} from "@models/user-task.ts";

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
            <Listy
                items={items}
                rowKey="id"
                classNames={{item: styles.listItem}}
                itemRender={(item) => (
                    <div className={styles.listItemMeta}>
                        <RecentTaskCard item={item}/>
                    </div>
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
    const [time, setTime] = useState(() => Date.now());
    const {t: translate} = useTranslation(["dashboard"]);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 10 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    const relativeDateTime = renderRelativeDateTime(time, date);
    return <Tooltip
        title={translate("recentTasksCard.creationDate", {date: renderDateTime(date)})}>
        <span>{relativeDateTime ? translate("recentTasksCard.createdAgo", {relativeDate: relativeDateTime}) :
            translate("recentTasksCard.createdNow")}</span>
    </Tooltip>
};