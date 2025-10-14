/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Col, Empty, Flex, Pagination, Row, Typography} from "antd";
import {useCallback, useState} from "react";
import {DataLoading} from "@components/data-loading/DataLoading.tsx";
import Title from "antd/es/typography/Title";
import {SearchInput} from "./SearchInput.tsx";
import {SyncOutlined} from "@ant-design/icons";
import Button from "antd/es/button";
import {useGetProcesses} from "@hooks/process";
import {useTranslation} from "react-i18next";
import {SortButton} from "./SortButton.tsx";
import {InternalError} from "@components/error/InternalError.tsx";
import {useProcessListPageStyles} from "./useProcessListPageStyles.ts";
import {usePaginatedList} from "@hooks/usePaginatedList.ts";
import {useQueryParam} from "@hooks/query-params";
import {ProcessCard} from "./ProcessCard.tsx";
import type {PaginationPayload, SortPayload} from "@models/common.ts";
import {MyActiveInstancesCard} from "@pages/process/active-instances/MyActiveInstancesCard.tsx";
import type {ProcessDefinition} from "@models/process.ts";

const {Text} = Typography;

const defaultPagination: PaginationPayload = {
    page: 1,
    size: 6
};

const defaultSort: SortPayload = {
    order: "asc",
    property: "name"
};


/**
 * A page that shows a list of the processes loaded from the backend. The page is opened from the top menu.
 * @constructor
 * @see useGetProcesses
 */
export const ProcessListPage = () => {
    const {t: translate} = useTranslation(["process"]);
    const {currentPageData, setPageData, currentSortData, setSortData} = usePaginatedList({
        defaultPagination,
        defaultSort
    });
    const {value} = useQueryParam({
        paramName: "q"
    });

    const [searchString, setSearchString] = useState<string | undefined | null>(value);

    const {data: processResponse, isLoading, error, refetch, isRefetching} = useGetProcesses({
        pagination: currentPageData,
        filter: {
            nameOrKeyOrDescriptionLike: searchString ? searchString : undefined
        },
        sort: currentSortData
    });
    const {styles} = useProcessListPageStyles();

    const handleSearch = useCallback((newSearchString?: string | null) => {
        if (searchString != newSearchString) {
            setSearchString(newSearchString);
        }
    }, [searchString]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const onPaginationChange = useCallback((page: number, pageSize: number) => {
        setPageData({
            page,
            size: pageSize
        });
    }, [setPageData]);

    if (isLoading || isRefetching) {
        return <DataLoading/>
    }

    if (error) {
        return <InternalError/>
    }
    const processList = processResponse?.data || [];
    const totalElements = processResponse?.totalElements || 0;

    return (
        <>
            <Row gutter={[0, 10]}
                 className={styles.pageRoot}>
                <Col xs={24} sm={14} md={14} xl={16} xxl={16}>
                    <Flex vertical={true} className={styles.layoutRoot} gap={10}>
                        <Header totalElements={totalElements}
                                loading={isLoading}
                                refetching={isRefetching}
                                onRefresh={handleRefresh}/>

                        <Row gutter={[0, 20]}>
                            {!isRefetching && <Col xs={24} sm={24} md={24} xl={24}>
                                <Flex gap="small" className={styles.sortFilterPaginationContainer}>
                                    <Flex gap="small" className={styles.sortFilterContainer}>
                                        <SearchInput onSearch={handleSearch}/>
                                        <SortButton onSort={setSortData} selectedSort={currentSortData || defaultSort}/>
                                    </Flex>

                                    <Pagination total={totalElements} pageSizeOptions={[6, 12, 24, 36, 72]}
                                                current={currentPageData?.page || defaultPagination.page}
                                                defaultPageSize={currentPageData?.size || defaultPagination.size}
                                                onChange={onPaginationChange} showSizeChanger={true}/>
                                </Flex>
                            </Col>}
                            <Col xs={24} md={24} xl={24}>
                                {isRefetching && <DataLoading/>}
                                {!isRefetching && processList && processList.length > 0 &&
                                    <Row gutter={[12, 18]}>
                                        {processList.map((process: ProcessDefinition) => <Col key={process.id}
                                                                                              className={styles.gridColumn}
                                                                                              xs={{flex: "100%"}}
                                                                                              sm={{flex: "100%"}}
                                                                                              md={{flex: "100%"}}
                                                                                              lg={{flex: "50%"}}
                                                                                              xl={{flex: "33.3%"}}>
                                            <ProcessCard item={process}/>
                                        </Col>)}
                                    </Row>
                                }
                                {!isRefetching && processList.length === 0 &&
                                    <Empty
                                        description={<Text>{translate("process:listPage.noProcessesFound")}</Text>}/>}
                            </Col>
                        </Row>
                    </Flex>
                </Col>
                <Col xs={24} sm={10} md={10} xl={8} xxl={6}>
                   <MyActiveInstancesCard/>
                </Col>
            </Row>
        </>
    );
};

interface HeaderProps {
    loading: boolean;
    refetching: boolean;
    totalElements: number;
    onRefresh: () => void;
}

const Header = ({refetching, loading, onRefresh, totalElements}: HeaderProps) => {
    const {t: translate} = useTranslation(["process"]);
    const {styles} = useProcessListPageStyles();

    return <Flex align="baseline" gap={3}>
        <Title level={3}
               className={styles.headerTitle}>{translate("process:listPage.header")}</Title>

        {totalElements !== undefined &&
            <Title level={4} className={styles.headerTotalElements}
                   type="secondary">({totalElements})</Title>}

        <Button type="text" shape="circle" icon={<SyncOutlined/>}
                title={translate("process:listPage.refresh")}
                loading={refetching}
                disabled={loading}
                className={styles.refreshButton}
                onClick={onRefresh}/>
    </Flex>;
};