/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Anchor, Flex} from "antd";
import type {ExternalLinkData} from "../types.ts";
import {ArrowUpOutlined} from "@ant-design/icons";
import {createStyles} from "antd-style";

const {Link} = Anchor;

const useStyles = createStyles(({css, token}) => {
    return {
        linkIcon: css`
            color: ${token.colorTextTertiary};
            transform: rotate(45deg);
        `
    }
});

export interface ExternalLinkItemProps {
    item: ExternalLinkData;
}

export const ExternalLinkListItem = ({item}: ExternalLinkItemProps) => {
    const {styles} = useStyles();
    return (
        <>
            <Flex align="center" gap="small">
                <Link target="_blank"
                      href={item.url}
                      title={item.label}
                />
                <ArrowUpOutlined className={styles.linkIcon}/>
            </Flex>
        </>
    );
};