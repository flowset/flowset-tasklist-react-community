/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import Button from "antd/es/button";
import {CheckOutlined, CloseOutlined, LogoutOutlined} from "@ant-design/icons";
import {Avatar, Dropdown, Flex, type MenuProps, Modal, Space, Typography} from "antd";
import {useCallback} from "react";
import {useTasklistAuth} from "../../hooks/useTasklistAuth.ts";
import type {User} from "../../features/auth/types.ts";
import {createStyles} from "antd-style";
import {useTranslation} from "react-i18next";

const {Text} = Typography;

const useStyles = createStyles(({token, css}) => ({
    userAvatar: css`
        color: ${token.colorPrimary};
        background-color: ${token.colorPrimaryBg};
        border: 1px solid ${token.colorPrimaryBorder};
    `,
}));

export const UserIndicator = () => {
    const {user, logout} = useTasklistAuth();
    const [modal, contextHolder] = Modal.useModal();
    const {t: translate} = useTranslation(["common", "userPanel"]);

    const showLogoutConfirm = useCallback(() => {
        modal.confirm({
            content: translate("userPanel:logoutConfirm.description"),
            okText: translate("common:actions.ok"),
            okButtonProps: {
                icon: <CheckOutlined/>
            },
            cancelText: translate("common:actions.cancel"),
            cancelButtonProps: {
                icon: <CloseOutlined/>
            },
            onOk: async () => {
                logout();
            },
        });
    }, [modal, logout, translate]);

    const username = getUserDisplayName(user);

    const handleMenuClick: MenuProps["onClick"] = (e) => {
        if (e.key === "logout") {
            showLogoutConfirm();
        }
    };

    const items: MenuProps["items"] = [
        {
            key: "header",
            label: <Space size={"small"} align={"center"}>
                <UserAvatar user={user}/>
                <Flex align={"start"} vertical={true}>
                    <Text strong={true}>{username}</Text>
                    {user?.email && <Text type={"secondary"}>{user.email}</Text>}
                </Flex>


            </Space>,
            disabled: true,
        },
        {
            type: "divider",
        },
        {
            label: translate("userPanel:logoutBtn.title"),
            key: "logout",
            icon: <LogoutOutlined/>,
        },
    ];
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <>
            {contextHolder}
            <Flex align={"center"}>
                <Dropdown menu={menuProps} trigger={["click"]}>
                    <Button shape="circle">
                        <UserAvatar user={user}/>
                    </Button>
                </Dropdown>
            </Flex>

        </>
    );
};

export interface UserAvatarProps {
    user: User | null;
}

const UserAvatar = ({user}: UserAvatarProps) => {
    const {styles} = useStyles();

    if (user && user.avatar) {
        return <Avatar src={user.avatar}/>
    }

    const avatarText = getUserAbbreviation(user);
    return (
        <Avatar className={styles.userAvatar}>
            {avatarText}
        </Avatar>
    );
}

const getUserDisplayName = (user?: User | null) => {
    if (!user) {
        return "unknown";
    }

    if (user.firstName && user.lastName) {
        return user.firstName + " " + user.lastName;
    }

    if (user.username) {
        return user.username;
    }

    return user.id || "unknown";
}

const getUserAbbreviation = (user: User | null) => {
    if (!user) {
        return "?";
    }

    let value: string = "?";
    if (user.firstName && user.lastName) {
        value = user.firstName.substring(0, 1) + user.lastName.substring(0, 1);
    } else if (user.username) {
        value = user.username.substring(0, 1);
    }

    return value.toUpperCase();
};

