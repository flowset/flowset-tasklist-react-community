/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Flex, Skeleton} from "antd";
import Title from "antd/es/typography/Title";
import {RecentActivityChart} from "./RecentActivityChart.tsx";
import {BarChartOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";
import type { TaskExecutionPeriodStatistics } from "../../../types/common.ts";

const useStyles = createStyles(({css, token, prefixCls}) => ({
    rootCard: css`
        & > .${prefixCls}-card-head {
            border-bottom: none;
        }

        & > .${prefixCls}-card-body {
            padding-top: 0;
        }
    `,

    contentContainer: css`
        height: 23em;
    `,

    skeletonContent: css`
        font-size: 40px;
        color: ${token.colorTextTertiary};
    `
}));


export interface RecentActivityCardProps {
    data?: TaskExecutionPeriodStatistics;
    loading: boolean;
}

export const RecentActivityCard = ({data, loading}: RecentActivityCardProps) => {
    const {
        styles,
    } = useStyles();
    const {t} = useTranslation(["dashboard"]);

    return (
        <>
            <Card className={styles.rootCard}
                  title={<Title level={4}>{t("recentActivityCard.title")}</Title>}>
                {!loading && data && <RecentActivityChart data={data}/>}
                {loading &&
                    <Flex className={styles.contentContainer} align="center" justify="center">
                        <Skeleton.Node active={true}>
                            <BarChartOutlined className={styles.skeletonContent}/>
                        </Skeleton.Node>
                    </Flex>
                }
            </Card>
        </>
    );
};