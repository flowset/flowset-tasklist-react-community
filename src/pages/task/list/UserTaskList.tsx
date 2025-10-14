/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Button, Flex} from "antd";
import {useCallback, useEffect, useState} from "react";
import Title from "antd/es/typography/Title";
import {TaskFilterToolbar} from "./filter/TaskFilterToolbar.tsx";
import {TaskDataTable} from "./TaskDataTable.tsx";
import {SyncOutlined} from "@ant-design/icons";
import {useGetUserTasks} from "@hooks/user-task/useGetUserTasks.ts";
import {useTranslation} from "react-i18next";
import {InternalError} from "@components/error/InternalError.tsx";
import {usePaginatedList} from "@hooks/usePaginatedList.ts";
import {createStyles} from "antd-style";
import type {PaginationPayload, SortPayload} from "@models/common.ts";
import type {TaskFilterPayload} from "@models/user-task.ts";

const defaultPagination: PaginationPayload = {
    page: 1,
    size: 10
};

const defaultSort: SortPayload = {
    order: "desc",
    property: "createDate"
};

const useStyles = createStyles(({token, css}) => ({
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
        margin-bottom: 0;
    `,
    headerTotalElements: css`
        margin-bottom: 0;
        font-weight: bold;
    `
}));


export interface UserTaskListProps {
    onTaskSelection: (taskId: string) => void
    lastCompletedTask?: string
    onError: () => void
}

export const UserTaskList = ({onTaskSelection, lastCompletedTask, onError}: UserTaskListProps) => {
    const {
        currentPageData,
        setPageData,
        setPageNumber,
        currentSortData,
        setSortData
    } = usePaginatedList({});

    const [filterData, setFilterData] = useState<TaskFilterPayload | undefined>();
    const {styles} = useStyles();

    const pagination = currentPageData || defaultPagination;
    const sort = currentSortData || defaultSort;
    const {
        data: taskListResponse,
        isError: isTasksLoadError,
        isLoading,
        isRefetching,
        error,
        refetch
    } = useGetUserTasks({
        pagination: pagination,
        filter: filterData,
        sort: sort,
    });

    useEffect(() => {
        if (isTasksLoadError) {
            onError();
        }
    }, [isTasksLoadError, onError]);

    useEffect(() => {
        refetch();
    }, [lastCompletedTask, refetch]);


    const handleFilterChange = useCallback((taskFilters?: TaskFilterPayload) => {
        setFilterData(taskFilters);
        setPageNumber(1);
    }, [setPageNumber]);

    const onRefreshButtonClick = useCallback(() => {
        refetch();
    }, [refetch]);

    const onTaskDataTablePaginationChange = useCallback((pageData: PaginationPayload) => {
        setPageData(pageData);
    }, [setPageData]);

    const onTaskDataTableSortChange = useCallback((sort?: SortPayload) => {
        setSortData(sort);
    }, [setSortData]);

    if (error) {
        return <InternalError/>
    }

    const loading = isLoading || isRefetching;


    return (
        <>
            <Flex vertical={true} className={styles.rootContainer} gap={10}>
                <Header
                    totalElements={taskListResponse?.totalElements}
                    isRefetching={isRefetching}
                    isLoading={loading}
                    onRefresh={onRefreshButtonClick}
                />
                <TaskFilterToolbar onApply={handleFilterChange}
                                   onReset={handleFilterChange}/>
                <TaskDataTable data={taskListResponse?.data} totalElements={taskListResponse?.totalElements}
                               loading={loading}
                               currentPageData={pagination}
                               currentSortData={sort}
                               onPaginationChange={onTaskDataTablePaginationChange}
                               onSortChange={onTaskDataTableSortChange}
                               onTaskSelect={onTaskSelection}/>
            </Flex>
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
    const {t: translate} = useTranslation(["userTask"]);
    const {styles} = useStyles();

    return (
        <Flex align="baseline" gap={3}>
            <Title level={3} className={styles.headerTitle}>
                {translate("userTask:listPage.myTasks")}
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
                title={translate("userTask:listPage.myTasks.actions.refresh")}
                disabled={isLoading}
                shape="circle"
                icon={<SyncOutlined/>}
                className={styles.refreshButton}
            />
        </Flex>
    );
};