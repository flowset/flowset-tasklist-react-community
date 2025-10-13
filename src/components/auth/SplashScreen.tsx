/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Flex, Spin} from "antd";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css}) => ({
    rootContainer: css`
        width: 100%;
        height: 100%;
    `,
}));

export const SplashScreen = () => {
    const {styles} = useStyles();

    return <Flex align="center" justify="center" className={styles.rootContainer}>
        <Spin/>
    </Flex>
};