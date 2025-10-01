/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Statistic} from "antd";
import {HourglassOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css, prefixCls, token}) => ({
    activeTaskStatistic: css`
        & > .${prefixCls}-statistic-content {
            color: ${token.colorSuccessActive};
        }
    `,
}));

export interface ActiveTasksCountCardProps {
    isLoading: boolean;
    data?: number;
}

export const ActiveTasksCountCard = ({data, isLoading}: ActiveTasksCountCardProps) => {
    const { t } = useTranslation("dashboard");
    const {styles} = useStyles();
    return (
        <>
            <Card variant={"outlined"}>
                <Statistic
                    title={t("activeTasksCard.title")}
                    loading={isLoading}
                    className={styles.activeTaskStatistic}
                    value={data}
                    prefix={<HourglassOutlined/>}
                />
            </Card>
        </>
    );
};