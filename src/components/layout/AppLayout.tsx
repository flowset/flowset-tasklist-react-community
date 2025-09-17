/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Layout} from "antd";
import {AppHeader} from "./AppHeader.tsx";
import {AppContent} from "./AppContent.tsx";
import {useTasklistAuth} from "../../hooks/useTasklistAuth.ts";
import {createStyles} from "antd-style";

const {Header, Content} = Layout;

const useStyles = createStyles(({css}) => ({
    appLayout: css`
        height: 100%;
    `,
    appHeader: css`
        position: sticky;
        top: 0;
        z-index: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center
    `,
    appContent: css`
        overflow: auto;
    `
}));


export const AppLayout = () => {
    const {isAuthenticated} = useTasklistAuth();
    const {styles} = useStyles();

    return (
        <>
            <Layout className={styles.appLayout}>
                {isAuthenticated && <Header className={styles.appHeader}>
                    <AppHeader/>
                </Header>}
                <Layout>
                    <Content className={styles.appContent}>
                        <AppContent/>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};