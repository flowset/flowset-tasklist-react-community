/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {Product} from "../types.ts";
import {Space, Typography} from "antd";
import {ExternalLinkListItem} from "./ExternalLinkListItem.tsx";
import {useTranslation} from "react-i18next";

const {Text} = Typography;

export interface ProductItemProps {
    item: Product;
}
export const ProductItem = ({item: product}: ProductItemProps) => {
    const {t: translate} = useTranslation(["aboutProduct"]);
    return (
        <>
            <Space direction={"vertical"}>
                <Text strong={true}>{product.name}</Text>
                <Text type={"secondary"}>{product.description}</Text>
                 <ExternalLinkListItem item={{
                     label: translate("learnMore.label"),
                     url: product.url
                 }}/>
            </Space>
        </>
    );
};