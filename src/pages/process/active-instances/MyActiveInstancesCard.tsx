import {Card, Empty, Flex, Space, Typography} from "antd";
import {useGetUserProcessInstances} from "@hooks/process";
import {SortOrder} from "@models/common.ts";
import {createStyles} from "antd-style";
import {InternalError} from "@components/error/InternalError.tsx";
import {Link} from "react-router-dom";
import {ActiveInstanceListItemCard} from "./ActiveInstanceListItemCard.tsx";
import {EyeOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

const {Title} = Typography;

const useStyles = createStyles(({css, token, prefixCls, responsive}) => ({
    rootContainer: css`
        margin-block-start: 5em;
    `,
    rootCard: css`
        border-color: ${token.colorBorder};
        width: 100%;
        height: 100%;

        & > .${prefixCls}-card-body {
            padding: 0 !important;
        }

        & > .${prefixCls}-card-head {
            background-color: ${token.colorFillTertiary};
        }
    `,
    headerRoot: css`
        gap: ${token.paddingXXS}px;
        overflow: hidden;
        text-overflow: ellipsis;
    `,
    headerTitle: css`
        margin: 0 !important;
        overflow: hidden;
        text-overflow: ellipsis;
    `,
    headerIcon: css`
        color: ${token.colorSuccess};
        margin-block: auto;
    `,
    emptyContainer: css`
        min-height: 25em;
    `,

    runningProcessLink : css`
        gap: ${token.paddingXXS}px;
        
        align-items: baseline;
        ${responsive.xs} {
            .${prefixCls}-space-item:last-child {
                display: none;
            }
        }
        ${responsive.sm} {
            .${prefixCls}-space-item:last-child {
                display: none;
            }
        }

        ${responsive.md} {
            .${prefixCls}-space-item:last-child {
                display: none;
            }
        }

        ${responsive.lg} {
            .${prefixCls}-space-item:last-child {
                display: none;
            }
        }
    `
}));

export const MyActiveInstancesCard = () => {
    const {data, isLoading, error} = useGetUserProcessInstances({
        pagination: {
            page: 1,
            size: 6
        },
        sort: {
            order: SortOrder.Desc,
            property: "startTime"
        }
    });

    const {styles} = useStyles();
    const {t: translate} = useTranslation(["processInstance"]);
    
    const runningInstances = data?.data || [];
    const totalElements = data?.totalElements || 0;
    const hasRunningInstances = runningInstances && runningInstances.length > 0;
    return (
        <>
            <Flex className={styles.rootContainer}>
                <Card loading={isLoading} className={styles.rootCard}
                      variant="outlined" title={<Header totalElements={totalElements}/>}
                      extra={<Link to="/processes/running-processes">
                          <Space className={styles.runningProcessLink}>
                              <EyeOutlined/>
                              <span>{translate("myActiveProcessesCard.actions.viewAll")}</span>
                          </Space>
                      </Link>}>
                    {!error && hasRunningInstances && <Flex vertical={true}>
                        {runningInstances.map((value, index) => {
                            const isLast = index === runningInstances.length - 1;
                            return <ActiveInstanceListItemCard item={value} key={index} isLast={isLast}/>;
                        })}
                    </Flex>}
                    {!error && !hasRunningInstances &&
                        <Flex vertical={true} className={styles.emptyContainer} align="center" justify="center">
                            <Empty description={translate("myActiveProcessesCard.noRunningInstances.description")}/>
                        </Flex>
                    }
                    {error && <InternalError/>}
                </Card>
            </Flex>

        </>
    );
};

interface HeaderProps {
    totalElements: number;
}

const Header = (props: HeaderProps) => {
    const {styles} = useStyles();
    const {t: translate} = useTranslation(["processInstance"]);
    
    return <Flex align={"baseline"} className={styles.headerRoot} wrap={true}>
        <Title className={styles.headerTitle} level={5}>{translate("myActiveProcessesCard.title")}</Title>
        <Title className={styles.headerTitle} level={5} type="secondary"> ({props.totalElements})</Title>
    </Flex>
};

