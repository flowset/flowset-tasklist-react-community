import {Table, type TableProps} from "antd";
import {createStyles} from "antd-style";

const useStyles = createStyles(({ css, token, prefixCls }) => {
    const antCls  = prefixCls;
    return {
        table: css`
            .${antCls}-spin-container {
                .${antCls}-table {
                    border: 1px solid ${token.colorBorderSecondary};
                    // use CSS variables because impossible to get component-specific token attribute
                    border-end-start-radius: var(--${antCls}-table-header-border-radius);
                    border-end-end-radius: var(--${antCls}-table-header-border-radius);

                    .${antCls}-table-column-sorter-inner {
                        color: ${token.colorWhite};
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
                                border-color: ${token.colorPrimaryBorder};
                            }
                        }
                    }
                }

                .${antCls}-table-pagination {
                    margin-top: 0;
                }
            }

            .${antCls}-table-column-sorter-inner > .${antCls}-table-column-sorter-up.active,
            .${antCls}-table-column-sorter-inner > .${antCls}-table-column-sorter-down.active {
                color: ${token.colorPrimaryTextHover};
            }
        `,
    };
});

export const StyledTable = <T,>(props: TableProps<T>) => {
    const {styles} = useStyles();
    const {className, ...restProps} = props;
    const resultClassName = className ? `${className} ${styles.table}` : styles.table;
    return (
        <>
            <Table size="small" {...restProps} className={resultClassName}/>
        </>
    );
};