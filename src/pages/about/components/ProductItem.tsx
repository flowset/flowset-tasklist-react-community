/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {Product} from "../types.ts";
import {Space, Typography} from "antd";
import {ExternalLinkListItem} from "./ExternalLinkListItem.tsx";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";

const {Text} = Typography;

const useStyles = createStyles(({css, token}, released) => ({
    productTitle: css`
        color: ${released ? token.colorTextBase : token.colorTextSecondary};
    `
}));

export interface ProductItemProps {
    item: Product;
}

export const ProductItem = ({item: product}: ProductItemProps) => {
    const {t: translate} = useTranslation(["aboutProduct"]);
    const {styles} = useStyles(product.released);
    const learMoreText = translate("learnMore.label");
    
    return (
        <>
            <Space orientation={"vertical"}>
                <Text strong={true} className={styles.productTitle}>{product.name}</Text>
                <Text type={"secondary"}>{product.description}</Text>
                <ExternalLinkListItem item={{
                    label: learMoreText,
                    url: product.url
                }}/>
            </Space>
        </>
    );
};