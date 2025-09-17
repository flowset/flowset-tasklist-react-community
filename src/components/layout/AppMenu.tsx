/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Link, useLocation} from "react-router-dom";
import {AppstoreOutlined, InfoCircleOutlined, PartitionOutlined, SolutionOutlined} from "@ant-design/icons";
import type {MenuProps} from 'antd';
import {Flex, Menu} from "antd";
import {createStyles} from "antd-style";
import {useTranslation} from "react-i18next";

type MenuItem = Required<MenuProps>['items'][number];

const useStyles = createStyles(({css, responsive}) => ({
    appMenuContainer: css`
        flex: 1 1 0;
`,
    appMenu: css`
        width: 100%;
        min-width: 0;
        font-size: medium;
        display: flex;
        justify-content: center;
        
        ${responsive.xs} {
            width: 70%;
        }
    `,
    menuIcon: css`
        font-size: inherit;
    `
}));

export const AppMenu = () => {
    const {pathname} = useLocation();
    const {styles} = useStyles();

    const {t: translate} = useTranslation();

    const selectedKey = toSelectedKey(pathname);

    const menuItems: MenuItem[] = [
        {
            label: (
                <Link to="dashboard">
                    {translate('common:menu.dashboard')}
                </Link>
            ),
            key: "dashboard",
            icon: <AppstoreOutlined className={styles.menuIcon}/>,
        },

        {
            label: (
                <Link to="tasks">
                    {translate('common:menu.tasks')}
                </Link>
            ),
            key: "tasks",
            icon: <SolutionOutlined className={styles.menuIcon}/>
        },
        {
            label: (
                <Link to="processes">
                    {translate('common:menu.processes')}
                </Link>
            ),
            key: "processes",
            icon: <PartitionOutlined className={styles.menuIcon}/>
        },
        {
            label: (
                <Link to="about">
                    {translate('common:menu.about')}
                </Link>
            ),
            key: "about",
            icon: <InfoCircleOutlined className={styles.menuIcon}/>
        }
    ];
    return (
        <>
            <Flex className={styles.appMenuContainer} >
                <Menu className={styles.appMenu}
                      selectedKeys={[selectedKey]}
                      items={menuItems} mode="horizontal" theme="dark"/>
            </Flex>

        </>
    );
};

const toSelectedKey = (pathname: string) => {
    if (pathname.length === 0) {
        return "dashboard";
    }
    return pathname.split("/", 2).join("");
}