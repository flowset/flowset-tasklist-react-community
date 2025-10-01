/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Statistic} from "antd";
import {FileDoneOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import type { TaskExecutionStatistics } from "@models/user-task.ts";

export interface MonthlyStatisticProps {
    data?: TaskExecutionStatistics;
    loading: boolean;
}

export const MonthlyStatisticsCard = ({data, loading}: MonthlyStatisticProps) => {
    const { t, i18n } = useTranslation(["common","dashboard"]);
    dayjs.locale(i18n.language);
    const monthlyCompletedTasksCount = data?.completedTasksCount || 0;
    const monthlyTotalCount = data?.totalTasks || 0;
    const monthName = dayjs().format("MMMM");
    return (
        <>
            <Card variant={"outlined"}>
                <Statistic
                    title={t("dashboard:completedTasksCard.title", { month: monthName})}
                    loading={loading}
                    value={`${monthlyCompletedTasksCount}/${monthlyTotalCount}`}
                    prefix={<FileDoneOutlined/>}
                />
            </Card>
        </>
    );
};