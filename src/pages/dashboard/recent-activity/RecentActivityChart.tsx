/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Flex, theme, Typography} from "antd";
import dayjs from "dayjs";
import {type BarDatum, type BarTooltipProps, type ComputedDatum, ResponsiveBar} from "@nivo/bar";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import {renderDate, renderDayMonth} from "@utils/format";
import {useCallback} from "react";
import {useTranslation} from "react-i18next";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import {createStyles} from "antd-style";
import type {TaskExecutionPeriodStatistics} from "@models/user-task.ts";

const { Text } = Typography;
export interface RecentActivityChartProps {
    data: TaskExecutionPeriodStatistics;
}

const useStyles = createStyles(({css, prefixCls}) => ({
    chartContainer: css`
        height: 23em!important;
    `,

    barTooltipCard: css`
        & > .${prefixCls}-card-body {
            padding: 1em;
            width: max-content;
        }
    `
}));

export const RecentActivityChart = ({
                                        data: {
                                            items,
                                            totalTasks,
                                            completedTasksCount
                                        }
                                    }: RecentActivityChartProps) => {
    const {
        token: {
            fontSize,
            fontFamily,
            fontSizeSM,
            colorWhite
        },
    } = theme.useToken();

    const {xs} = useBreakpoint();
    const {t: translate, i18n} = useTranslation(["dashboard"]);
    const {styles} = useStyles();

    dayjs.locale(i18n.language);

    const completedTaskGroup = translate("recentActivityCard.completedTasks");
    const createdTaskGroup = translate("recentActivityCard.createdTasks");

    const tasksBarChartTheme = {
        text: {
            fontSize: xs ? fontSizeSM : fontSize,
            fontFamily: fontFamily
        }
    };

    const legendData = [{
        id: completedTaskGroup,
        label: `${completedTaskGroup} (${completedTasksCount})`,
        color: "#1240AB"
    },
        {
            id: createdTaskGroup,
            label: `${createdTaskGroup} (${totalTasks})`,
            color: "#009999"
        }
    ];

    const barData: BarDatum[] = items ? items.map(value => {
        const barDataItem: BarDatum = {};
        barDataItem.date = value.date || "";
        barDataItem[completedTaskGroup] = value.completedTasksCount;
        barDataItem[createdTaskGroup] = value.totalTasks;

        return barDataItem;
    }) : [];

    const barColors = useCallback((data: ComputedDatum<BarDatum>) => {
        if (data.id === completedTaskGroup) {
            return "#1240AB";
        }
        return "#009999";
    }, [completedTaskGroup]);


    const noData = totalTasks === 0 && completedTasksCount === 0;

    return (
        <>
            <div className={styles.chartContainer}>
                <ResponsiveBar
                    tooltip={props => <BarTooltip {...props}/>}
                    data={barData}
                    keys={[completedTaskGroup, createdTaskGroup]}
                    theme={tasksBarChartTheme}
                    labelTextColor={colorWhite}
                    indexBy="date"
                    margin={{top: 60, right: 40, bottom: 40, left: 40}}
                    padding={0.3}
                    groupMode="grouped"
                    valueScale={{type: "linear", min: noData ? 0 : "auto", max: noData ? 1 : "auto"}}
                    indexScale={{type: "band"}}
                    colors={barColors}
                    axisBottom={{
                        tickRotation: xs ? 45 : 0,
                        format: value => renderDayMonth(value)
                    }}
                    axisLeft={{
                        tickValues: noData ? 1 : 7,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    legends={[
                        {
                            dataFrom: "keys",
                            anchor: "top-left",
                            direction: xs ? "column" : "row",
                            translateY: xs ? -60 : -50,
                            itemWidth: xs ? 100 : 220,
                            itemHeight: 20,
                            itemDirection: "left-to-right",
                            itemOpacity: 0.85,
                            symbolSize: xs ? 10 : 20,
                            data: legendData
                        }
                    ]}
                />
            </div>
        </>
    );
};


const BarTooltip = (props: BarTooltipProps<BarDatum>) => {
    const {t: translate} = useTranslation("dashboard");
    const {styles} = useStyles();

    return (
        <>
            <Card className={styles.barTooltipCard}>
                <Flex vertical={true} gap={5}>
                    <Text strong={true}>{props.id}</Text>
                    <Flex gap={5}>
                        <Text strong>{translate("recentActivityCard.bar.date")}:</Text>
                        <Text>{renderDate(props.indexValue as string)}</Text>
                    </Flex>
                    <Flex gap={5}>
                        <Text strong>{translate("recentActivityCard.bar.count")}:</Text>
                        <Text>{props.value}</Text>
                    </Flex>
                </Flex>
            </Card>
        </>
    );
};
