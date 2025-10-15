import {useGetUserProcessInstances} from "@hooks/process";
import {type PaginationPayload, type SortPayload} from "@models/common.ts";
import {useTranslation} from "react-i18next";
import {usePaginatedList} from "@hooks/usePaginatedList.ts";
import {Button, Flex, Row, Typography} from "antd";
import {useCallback, useState} from "react";
import Col from "antd/es/grid/col";
import {createStyles} from "antd-style";
import {SyncOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {InternalError} from "@components/error/InternalError.tsx";
import {InstanceFilterToolbar} from "./filter/InstanceFilterToolbar.tsx";
import {InstanceDataTable} from "./table/InstanceDataTable.tsx";
import type {ProcessInstanceFilterPayload} from "@models/process.ts";
import {StyledBreadcrumb} from "@components/breadcrumb/StyledBreadcrumb.tsx";

const {Title} = Typography;

const useStyles = createStyles(({css, token}) => {
    return {
        rootGrid: css`
            height: 100%;
            justify-content: center;
            flex-grow: 1;
        `,

        listContainer: css`
            padding: 2em 1em 2.5em 2em;
        `,
        rootContainer: css`
            min-height: 100%;
            width: 100%;
            background-color: ${token.colorWhite};
            padding-inline: 2em;
            border: 1px solid ${token.colorBorderSecondary}
            border-radius: 10px;
            padding-bottom: 1em;
        `,
        refreshButton: css`
            color: ${token.colorTextTertiary};
        `,

        headerTitle: css`
            margin: 0 !important;
        `,
        headerTotalElements: css`
            margin-bottom: 0;
            font-weight: bold;
        `,

        breadcrumbs: css`
            padding-top: ${token.paddingMD}px;
        `
    }
});


const defaultPagination: PaginationPayload = {
    page: 1,
    size: 10
};

const defaultSort: SortPayload = {
    order: "desc",
    property: "startTime"
};


export const MyActiveInstancesPage = () => {
    const {t: translate} = useTranslation(["processInstance", "process"]);
    const [filterData, setFilterData] = useState<ProcessInstanceFilterPayload | undefined>();
    const {currentPageData, setPageData, currentSortData, setSortData} = usePaginatedList({});

    const pagination = currentPageData || defaultPagination;
    const sort = currentSortData || defaultSort;

    const {data, isLoading, error, isRefetching, refetch} = useGetUserProcessInstances({
        pagination: pagination,
        sort: sort,
        filter: filterData,
    });

    const {styles: pageStyles} = useStyles();

    const onRefreshButtonClick = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleFilterReset = useCallback(() => {
        setFilterData(undefined);
    }, []);

    const onInstanceTablePaginationChange = useCallback((pageData: PaginationPayload) => {
        setPageData(pageData);
    }, [setPageData]);

    const onInstanceDataTableSortChange = useCallback((sort?: SortPayload) => {
        setSortData(sort);
    }, [setSortData]);

    const totalElements = data?.totalElements || 0;
    const runningProcesses = data?.data || [];
    const loading = isLoading || isRefetching;

    return (
        <>
            <Row className={pageStyles.rootGrid}>
                <Col xs={24}
                     sm={24}
                     md={19}
                     xl={18}
                     xxl={16}
                     className={pageStyles.listContainer}>
                    <Flex vertical={true} className={pageStyles.rootContainer} gap={10}>
                        <StyledBreadcrumb className={pageStyles.breadcrumbs}
                                          items={[
                                              {
                                                  title: <Link
                                                      to="/processes">{translate("process:listPage.header")}</Link>,
                                              },
                                              {
                                                  title: translate("processInstance:listPage.myActiveProcesses"),
                                              },
                                          ]}
                        />
                        <Header totalElements={totalElements}
                                isRefetching={isRefetching}
                                isLoading={loading}
                                onRefresh={onRefreshButtonClick}
                        />

                        <InstanceFilterToolbar onApply={setFilterData}
                                               onReset={handleFilterReset}/>
                        {!error ? <InstanceDataTable data={runningProcesses} loading={loading}
                                                     totalElements={totalElements}
                                                     currentPageData={pagination}
                                                     currentSortData={sort}
                                                     onPaginationChange={onInstanceTablePaginationChange}
                                                     onSortChange={onInstanceDataTableSortChange}
                        /> : <InternalError/>}
                    </Flex>

                </Col>

            </Row>
        </>
    );
};

interface HeaderProps {
    totalElements?: number;
    isRefetching: boolean;
    isLoading: boolean;
    onRefresh: () => void;
}

const Header = ({
                    totalElements,
                    isRefetching,
                    isLoading,
                    onRefresh
                }: HeaderProps) => {
    const {t: translate} = useTranslation(["processInstance", "common"]);
    const {styles} = useStyles();

    return (
        <Flex align="baseline" gap={3}>
            <Title level={3} className={styles.headerTitle}>
                {translate("processInstance:listPage.myActiveProcesses")}
            </Title>
            {totalElements !== undefined && (
                <Title level={4} className={styles.headerTotalElements} type="secondary">
                    ({totalElements})
                </Title>
            )}
            <Button
                type="text"
                loading={isRefetching}
                onClick={onRefresh}
                title={translate("common:actions.refresh")}
                disabled={isLoading}
                shape="circle"
                icon={<SyncOutlined/>}
                className={styles.refreshButton}
            />
        </Flex>
    );
};