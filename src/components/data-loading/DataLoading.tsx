/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Flex, Spin} from "antd";
import Title from "antd/es/typography/Title";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css}) => ({
    rootContainer: css`
        width: 100%;
        height: 40vh;
    `,
}));

export interface DataLoadingProps {
    text?: string;
}

export const DataLoading = ({text}: DataLoadingProps) => {
    const {t: translate} = useTranslation("common");
    const {styles} = useStyles();

    return <Flex className={styles.rootContainer} align="center" justify="center">
        <Flex justify="center" vertical={true}>
            <Spin/>
            <Title level={3}>{text || translate("dataLoading.text")}</Title>
        </Flex>
    </Flex>
};