/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {createStyles} from "antd-style";

/**
 * AntDesign styles for {@link ProcessListPage}.
 */
export const useProcessListPageStyles = createStyles(({css, token}) => ({
    pageRoot: css`
        height: 100%;
        justify-content: center;
        flex-grow: 1;
        padding: 2em 1em 0 2em;
    `,
    layoutRoot: css`
        min-height: 100%;
        width: 100%;
        padding-inline: 2em;
    `,

    refreshButton: css`
        color: ${token.colorTextTertiary};
    `,

    gridColumn: css`
        display: flex;
    `,
    headerTitle: css`
        margin-bottom: 0;
        margin-top: 0;
    `,
    headerTotalElements: css`
        margin-bottom: 0;
        margin-top: 0;
        font-weight: "bold";
    `
}));