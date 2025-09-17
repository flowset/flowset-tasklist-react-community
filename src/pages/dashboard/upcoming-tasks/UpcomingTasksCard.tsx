/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Empty, Flex, Typography} from "antd";
import Title from "antd/es/typography/Title";
import {FireOutlined} from "@ant-design/icons";
import {DashboardSkeletonTasks} from "../DashboardSkeletonTasks.tsx";
import {UpcomingTaskList} from "./UpcomingTaskList.tsx";
import {useTranslation} from "react-i18next";
import {useListCardStyles} from "../useListCardStyles.ts";
import {createStyles} from "antd-style";
import type {UserTask} from "../../../types/common.ts";


const {Text} = Typography;

const useStyles = createStyles(({css, token}) => ({
    headerIcon: css`
        color: ${token.colorWarningText};
        font-size: medium;
    `,
    headerTitle: css`
        margin-top: 1em;
        color: ${token.colorTextSecondary}
    `
}));

export interface UpcomingTasksCardProps {
    items?: UserTask[]
    loading: boolean
}


export const UpcomingTasksCard = ({items, loading}: UpcomingTasksCardProps) => {
    const hasLoadedTasks = items && items.length > 0;
    const {styles} = useListCardStyles();
    return (

        <>
            <Card className={styles.rootCard} title={<Header/>}
                  variant={"outlined"}>
                {loading && <DashboardSkeletonTasks/>}
                {!loading && !hasLoadedTasks && <NoTasks/>}
                {!loading && hasLoadedTasks && <UpcomingTaskList items={items}/>}
            </Card>
        </>
    );
};
const Header = () => {
    const {t} = useTranslation(["dashboard"]);
    const {styles} = useListCardStyles();
    const {styles: upcomingTasksStyles} = useStyles();
    return (
        <>
            <Flex className={styles.cardHeader}>
                <FireOutlined className={upcomingTasksStyles.headerIcon}/>
                <Title level={4}
                       className={upcomingTasksStyles.headerTitle}>{t("upcomingTasksCard.title")}</Title>
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
