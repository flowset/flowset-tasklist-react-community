import {Breadcrumb, type BreadcrumbProps} from "antd";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css, prefixCls, token}) => ({
        breadcrumb: css`
            .${prefixCls}-breadcrumb-link > a {
                color: ${token.colorPrimary};
            }

            .${prefixCls}-breadcrumb-link > a:hover {
                background-color: ${token.colorPrimaryBgHover};
            }
        `
    })
);

export const StyledBreadcrumb = (props: BreadcrumbProps) => {
    const {styles} = useStyles();
    const {className, ...restProps} = props;
    const resultClassName = className ? `${className} ${styles.breadcrumb}` : styles.breadcrumb;

    return (
        <>
            <Breadcrumb separator=">" className={resultClassName} {...restProps}/>
        </>
    );
};