/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Button, Dropdown, type MenuProps, Space, Typography} from "antd";
import i18n from "../../features/i18n/config.ts";
import {ArrowDownOutlined, ArrowUpOutlined, SortAscendingOutlined} from "@ant-design/icons";
import type {SortPayload} from "../../types/common.ts";

const {Text} = Typography;

const sortOptions: MenuProps["items"] = [
    {
        label: <Space>
            <Text>{i18n.t("process:name")}</Text>
            <ArrowUpOutlined/>
        </Space>,
        key: "name_asc",
    },
    {
        label: <Space>
            <Text>{i18n.t("process:name")}</Text>
            <ArrowDownOutlined/>
        </Space>,
        key: "name_desc",
    },
    {
        label: <Space>
            <Text>{i18n.t("process:key")}</Text>
            <ArrowUpOutlined/>
        </Space>,
        key: "key_asc",
    },
    {
        label: <Space>
            <Text>{i18n.t("process:key")}</Text>
            <ArrowDownOutlined/>
        </Space>,
        key: "key_desc",
    }
];

export interface SortButtonProps {
    onSort: (sortData: SortPayload) => void;
    selectedSort: SortPayload;
}

/**
 * Dropdown button to sort processes on the {@link ProcessListPage}
 * @param onSort a handler for sorting
 * @param selectedSort a sort that should be currently selected
 * @constructor
 */
export const SortButton = ({onSort, selectedSort}: SortButtonProps) => {
    const handleMenuClick: MenuProps["onClick"] = ({key}) => {
        const values = key.split("_");
        const newSortField = values[0];
        const newSortOrder = values[1];
        onSort({
            property: newSortField,
            order: newSortOrder,
        });
    }

    const menuProps = {
        items: sortOptions,
        onClick: handleMenuClick,
        selectable: true,
        defaultSelectedKeys: [`${selectedSort.property}_${selectedSort.order}`]
    };
    return (
        <>
            <Dropdown menu={menuProps} trigger={["click"]}>
                <Button>
                    <SortAscendingOutlined/>
                </Button>
            </Dropdown>
        </>
    );
};