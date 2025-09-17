/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Statistic} from "antd";
import {ClockCircleOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css, prefixCls, token}) => ({
    overdueTaskStatistic: css`
        & > .${prefixCls}-statistic-content {
            color: ${token.colorError};
        }
    `,
}));

export interface OverdueTasksCountCardProps {
    isLoading: boolean,
    data?: number
}

export const OverdueTasksCountCard = ({data, isLoading}: OverdueTasksCountCardProps) => {
    const {t} = useTranslation('dashboard');
    const {styles} = useStyles();
    return (
        <>
            <Card variant={"outlined"}>
                <Statistic
                    title={t('overdueTasksCard.title')}
                    loading={isLoading}
                    value={data}
                    className={styles.overdueTaskStatistic}
                    prefix={<ClockCircleOutlined/>}
                />
            </Card>
        </>
    );
};