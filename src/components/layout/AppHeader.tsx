
/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {AppMenu} from "./AppMenu.tsx";
import Title from "antd/es/typography/Title";
import {Flex} from "antd";
import {UserIndicator} from "../auth/UserIndicator.tsx";
import {createStyles} from "antd-style";

const useStyles = createStyles(({token, css, responsive}) => ({
    logoContainer: css`
        line-height: initial;
        margin-right: 1em;
    `,
    appIcon: css`
        width: 2em;
        height: 2em;
        line-height: 0;
    `,

    appTitle: css`
        color: ${token.colorWhite}!important;
        margin: auto!important;
        
        ${responsive.xs} {
            display: none;
        }

        ${responsive.sm} {
            display: none;
        }
        
        
    `,
    controlsContainer: css`
        margin-left: 4em;
    `,
}));

export const AppHeader = () => {
    const {styles} = useStyles();

    return (
        <>
            <Flex className={styles.logoContainer} gap={5} align={"baseline"}>
                <img src="/logo-dark.svg" className={styles.appIcon} alt=""/>
                <Title level={4} className={styles.appTitle}>OpenBPM Tasklist</Title>
            </Flex>
            <AppMenu/>
            <div className={styles.controlsContainer}>
                <UserIndicator/>
            </div>
        </>
    );
};