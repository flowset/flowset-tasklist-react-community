/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Button, Col, Flex, Row} from "antd";
import {UpcomingTasksCard} from "./upcoming-tasks/UpcomingTasksCard.tsx";
import {RecentTasksCard} from "./recent-tasks/RecentTasksCard.tsx";
import Title from "antd/es/typography/Title";
import {MonthlyStatisticsCard} from "./monthly-tasks/MonthlyStatisticsCard.tsx";
import {RecentActivityCard} from "./recent-activity/RecentActivityCard.tsx";
import {ActiveTasksCountCard} from "./active-tasks/ActiveTasksCountCard.tsx";
import {OverdueTasksCountCard} from "./overdue-tasks/OverdueTasksCountCard.tsx";
import {SyncOutlined} from "@ant-design/icons";
import {useCallback} from "react";
import {useGetUserTaskStatistics} from "../../hooks/user-task/useGetUserTaskStatistics.ts";
import {useTasklistAuth} from "../../hooks/useTasklistAuth.ts";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";
import {InternalError} from "../../components/error/InternalError.tsx";

const useStyles = createStyles(({css, token, responsive}) => ({
    rootGrid: css`
        padding-inline: 2em;
        padding-top: 2em;
        padding-bottom: 1em;
        height: 100%;
        width: 100%;

        ${responsive.xxl} {
            height: 10em;
        }
    `,

    headerContainer: css`
        gap: 0.25em;
    `,

    headerTitle: css`
        margin-top: 0;
    `,

    refreshButton: css`
        color: ${token.colorTextTertiary};
    `
}));

export const DashboardPage = () => {
    const {t: translate} = useTranslation(["common", "dashboard"]);

    const auth = useTasklistAuth();
    const {data: userTaskStatistics, isLoading, isRefetching, refetch, error} = useGetUserTaskStatistics({
        username: auth?.user?.username
    });

    const {styles} = useStyles();

    const loading = isLoading || isRefetching;
    const onRefreshButtonClick = useCallback(() => {
        refetch();
    }, [refetch]);


    if (error) {
        return <InternalError/>
    }

    return (
        <>
            <Row className={styles.rootGrid}
                 gutter={[10, 10]}>
                <Col xs={24}>
                    <Flex align="baseline" className={styles.headerContainer}>
                        <Title level={3} className={styles.headerTitle}>{translate("dashboard:myTasksOverview")}</Title>
                        <Button type="text" shape="circle"
                                className={styles.refreshButton}
                                icon={<SyncOutlined/>}
                                loading={isRefetching}
                                title={translate("dashboard:refreshDashboard")}
                                disabled={isLoading}
                                onClick={onRefreshButtonClick}/>
                    </Flex>


                </Col>
                <Col xs={24} sm={24} md={24} lg={14} xl={12}>
                    <Row gutter={[10, 10]}>
                        <Col xs={12} sm={8} md={8} xl={8}>
                            <ActiveTasksCountCard isLoading={loading}
                                                  data={userTaskStatistics?.activeTasksCount}/>
                        </Col>
                        <Col xs={12} sm={8} md={8} xl={8}>
                            <OverdueTasksCountCard isLoading={loading}
                                                   data={userTaskStatistics?.overdueTasksCount}/>
                        </Col>
                        <Col xs={12} sm={8} md={8} xl={8}>
                            <MonthlyStatisticsCard loading={loading} data={userTaskStatistics?.monthlyStatistics}/>
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={24} xl={24}>
                            <RecentActivityCard loading={loading} data={userTaskStatistics?.weeklyActivity}/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={15} md={12} lg={10} xl={6}>
                    <RecentTasksCard items={userTaskStatistics?.lastCreatedTasks} loading={loading}/>
                </Col>
                <Col xs={24} sm={15} md={12} lg={10} xl={6}>
                    <UpcomingTasksCard items={userTaskStatistics?.upcomingTasks} loading={loading}/>
                </Col>
            </Row>
        </>
    );
};