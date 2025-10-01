/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Empty, Flex, Typography} from "antd";
import {HistoryOutlined} from "@ant-design/icons";
import {DashboardSkeletonTasks} from "../DashboardSkeletonTasks.tsx";
import {RecentTaskList} from "./RecentTaskList.tsx";
import {useTranslation} from "react-i18next";
import {useListCardStyles} from "../useListCardStyles.ts";
import {createStyles} from "antd-style";
import type {UserTask} from "@models/user-task.ts";

export interface RecentTasksCardProps {
    items?: UserTask[];
    loading: boolean;
}

const {Text, Title} = Typography;

const useStyles = createStyles(({css, token}) => ({
    headerIcon: css`
        color: rgba(0, 0, 0, .45);
        font-size: medium;
    `,
    headerTitle: css`
        margin-top: 1em;
        color: ${token.colorTextSecondary}
    `
}));

export const RecentTasksCard = ({items, loading}: RecentTasksCardProps) => {
    const hasLoadedTasks = items && items.length > 0;
    const {styles} = useListCardStyles();

    return (
        <>
            <Card className={styles.rootCard} title={<Header/>} variant={"outlined"}>
                {loading && <DashboardSkeletonTasks/>}
                {!loading && !hasLoadedTasks && <NoTasks/>}
                {!loading && hasLoadedTasks && <RecentTaskList items={items}/>}
            </Card>
        </>
    );
};

const Header = () => {
    const {styles: recentTasksStyles} = useStyles();
    const {t} = useTranslation(["dashboard"]);
    const {styles} = useListCardStyles();
    return (
        <>
            <Flex className={styles.cardHeader}>
                <HistoryOutlined className={recentTasksStyles.headerIcon}/>
                <Title level={4} className={recentTasksStyles.headerTitle}>{t("recentTasksCard.title")}</Title>
            </Flex>
        </>
    );
};

const NoTasks = () => {
    const {t} = useTranslation(["dashboard"]);
    const {styles} = useListCardStyles();
    return (
        <>
            <Flex className={styles.emptyCardContent}>
                <Empty description={<Text type="secondary" strong={true}>{t("noTasks")}</Text>}/>
            </Flex>
        </>
    );
};