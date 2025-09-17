/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {createStyles} from "antd-style";

export const useTaskDataTableStyles = createStyles(({ css, token, prefixCls }) => {
    const antCls  = prefixCls;
    return {
        taskTable: css`
            .${antCls}-spin-container {
                .${antCls}-table {
                    border: 1px solid ${token.colorBorderSecondary};
                    // use CSS variables because impossible to get component-specific token attribute
                    border-end-start-radius: var(--${antCls}-table-header-border-radius);
                    border-end-end-radius: var(--${antCls}-table-header-border-radius);

                    .${antCls}-table-column-sorter-inner > span {
                        color: var(--task-table-sort-icon-color);
                    }
                    
                    & > .${antCls}-table-container table > tbody > tr:last-child > *:first-child {
                        border-end-start-radius: var(--${antCls}-table-header-border-radius);
                    }
                    & > .${antCls}-table-container table > tbody > tr:last-child > *:last-child {
                        border-end-end-radius: var(--${antCls}-table-header-border-radius);
                    }
                    
                    .${antCls}-table-container {
                        .${antCls}-table-body {
                            overflow-y: auto;
                            scrollbar-width: auto;
                            scrollbar-color: auto;

                            .${antCls}-table-cell {
                                border-color: var(--task-table-cell-border-color);
                            }
                        }

                        ${antCls}-table-body::-webkit-scrollbar {
                            width: var(--task-table-scroll-width);
                        }

                        ${antCls}-table-body::-webkit-scrollbar-track {
                            background-color: var(--task-table-scroll-background-color);
                        }

                        ${antCls}-table-body::-webkit-scrollbar-thumb {
                            border-radius: var(--task-table-scroll-border-radius);
                            background-color: var(--task-table-scroll-color);
                        }

                        .${antCls}-table-content {
                            scrollbar-width: thin;
                            scrollbar-color: #eaeaea transparent;
                            scrollbar-gutter: stable;
                        }
                    }
                }

                .${antCls}-table-pagination {
                    margin-top: 0;
                }
            }

            .${antCls}-table-wrapper .${antCls}-table-column-sorter-up.active,
            .${antCls}-table-wrapper .${antCls}-table-column-sorter-down.active {
                color: var(--task-table-sort-icon-active-color);
            }
        `,
    };
});