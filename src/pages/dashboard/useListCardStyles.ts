/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {createStyles} from "antd-style";

export const useListCardStyles = createStyles(({css, prefixCls}) => ({
    rootCard: css`
        & > .${prefixCls}-card-body {
            padding: 0 0 1em;
            height: 34em;
        }
        & > .${prefixCls}-card-head {
            border-bottom: none;
        }
    `,
    cardHeader: css`
        padding-inline: 1em;
        justify-content: center;
        align-items: baseline;
        gap: 0.5em;
    `,
    emptyCardContent: css`
        height: 50%;
        justify-content: center;
        align-items: center;
    `,
    listItem: css`
        border-block-end: none !important;
        padding-inline: 1em !important;
        padding-bottom: 0 !important;
    `,

    listItemMeta: css`
        width: 100%;
    `,
    listItemCard: css`
        & > .${prefixCls}-card-body {
            padding: 1em;
        }
        
        &:hover {
            background-color: rgba(230, 244, 255, 0.5); 
        }
        
        &:active {
            background-color: rgba(230, 244, 255, 0.8);
        }
    `,
}));
