/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {TableProps} from "antd";
import {Table, type TablePaginationConfig, Typography} from "antd";
import Button from "antd/es/button";
import {FormOutlined} from "@ant-design/icons";
import {useCallback} from "react";
import {
    getProcessDefinitionRecordRepresentation
} from "../../../utils/record-representation/getProcessDefinitionRecordRepresentation.ts";
import {renderDateTime} from "../../../utils/format/renderDateTime.ts";
import {TaskDueDate} from "../../../components/user-task/TaskDueDate.tsx";
import {TaskPriority} from "../../../components/user-task/TaskPriority.tsx";
import {convertStringToTableSortOrder} from "../../../utils/sort/convertStringToTableSortOrder.ts";
import {
    type PaginationPayload,
    SortOrder,
    type SortPayload,
    type UserTask
} from "../../../types/common.ts";
import type {SorterResult, TableCurrentDataSource} from "antd/lib/table/interface";
import i18n from "../../../features/i18n/config.ts";
import {useTranslation} from "react-i18next";
import {usePagination} from "../../../hooks/usePagination.ts";
import {useSort} from "../../../hooks/useSort.ts";
import {useTaskDataTableStyles} from "./useTaskDataTableStyles.ts";
import {useTaskSelection} from "../../../hooks/user-task/useTaskSelection.ts";

type OnChange = NonNullable<TableProps<UserTask>["onChange"]>;
const {Text} = Typography;

interface TaskDataTableProps {
    totalElements?: number;
    data?: UserTask[];
    loading: boolean;
    onTaskSelect: (id: string) => void;
    onPaginationChange: (pageData: PaginationPayload) => void;
    onSortChange: (sort?: SortPayload) => void;
}

export const TaskDataTable = ({
                              totalElements,
                              data,
                              loading,
                              onTaskSelect,
                              onPaginationChange,
                              onSortChange
                          }: TaskDataTableProps) => {
    const {selectedTaskId} = useTaskSelection();

    const {currentPageSize, currentPage} = usePagination();
    const {currentSortData} = useSort();

    const tableOrder = convertStringToTableSortOrder(currentSortData?.order);

    const {t: translate} = useTranslation(["userTask"]);
    const {styles} = useTaskDataTableStyles();

    const columns: TableProps<UserTask>["columns"] = [
        {
            title: i18n.t("userTask:name"),
            dataIndex: "name",
            key: "name",
            sorter: true,
            sortOrder: currentSortData?.property === "name" ? tableOrder : undefined
        },
        {
            title: i18n.t("userTask:processDefinition"),
            dataIndex: "processDefinition",
            key: "processDefinition",
            render: (_, {processDefinition}) =>
                <Text>{getProcessDefinitionRecordRepresentation(processDefinition)}</Text>,
            responsive: ["md"],
        },
        {
            title: i18n.t("userTask:createDate"),
            dataIndex: "createDate",
            key: "createDate",
            render: (_, {createDate}) => <Text>{renderDateTime(createDate)}</Text>,
            sorter: true,
            sortOrder: currentSortData?.property === "createDate" ? tableOrder : undefined
        },
        {
            title: i18n.t("userTask:dueDate"),
            dataIndex: "dueDate",
            key: "dueDate",
            render: (_, {dueDate}) => <TaskDueDate value={dueDate}/>,
            responsive: ["xl"],
            sorter: true,
            sortOrder: currentSortData?.property === "dueDate" ? tableOrder : undefined
        },
        {
            title: i18n.t("userTask:priority"),
            key: "priority",
            dataIndex: "priority",
            render: (_, {priority}) => priority ? <TaskPriority value={priority}/> : undefined,
            responsive: ["xl"],
            sorter: true,
            sortOrder: currentSortData?.property === "priority" ? tableOrder : undefined,

        },
        {
            render: (_, {id}) => (
                <Button type="link" size="large"
                        onClick={(event) => handleEdit(event, id)}>
                    <FormOutlined/>
                </Button>
            ),
        }
    ];

    const handleEdit = useCallback((event: React.MouseEvent<HTMLElement>, id: string) => {
        event.stopPropagation();
        onTaskSelect(id);
    }, [onTaskSelect]);

    const getTaskRowProps = useCallback((task: UserTask) => {
        return {
            onClick: () => onTaskSelect(task.id)
        };
    }, [onTaskSelect]);

    const handleColumnSortChange = useCallback((sorter: SorterResult<UserTask>) => {
        if (!sorter.order) {
            onSortChange();
        } else {
            const order = sorter.order === "descend" ? SortOrder.Desc : SortOrder.Asc;
            const property = sorter.field as string;

            onSortChange({order: order, property: property});
        }
    }, [onSortChange]);

    const handlePaginationChange = useCallback((pagination: TablePaginationConfig) => {
        onPaginationChange({page: pagination.current || 1, size: pagination.pageSize || 10});
    }, [onPaginationChange]);

    const handleTableChange: OnChange = useCallback((pagination: TablePaginationConfig, _filters: Record<string, unknown>,
                                                         sorter: SorterResult<UserTask> | SorterResult<UserTask>[], _extra: TableCurrentDataSource<unknown>) => {
        if (pagination && pagination.current !== currentPage || pagination.pageSize !== currentPageSize) {
            handlePaginationChange(pagination);
        }
        if (sorter && !Array.isArray(sorter)) {
            handleColumnSortChange(sorter);
        }
    }, [handleColumnSortChange, currentPage, handlePaginationChange]);

    const tableScroll = totalElements && totalElements > 5 ? "20em" : undefined;

    return (
        <>
            <Table columns={columns} rowKey="id"
                   size="small"
                   className={styles.taskTable}
                   scroll={{y: tableScroll}}
                   loading={loading}
                   rowClassName={record => record.id === selectedTaskId ? "ant-table-row-selected" : ""}
                   dataSource={data}
                   pagination={{
                       position: ["topRight", "none"],
                       total: totalElements && totalElements > 0 ? totalElements : 1, //if total is 0, pagination is hidden
                       showTotal: (total, range) =>
                           totalElements && totalElements > 0 ? translate("listPage.tasksTable.paginationTotal",
                               {
                                   startItem: range[0],
                                   endItem: range[1],
                                   total
                               }) : undefined,
                       defaultCurrent: currentPage,
                       current: currentPage,
                       defaultPageSize: currentPageSize,
                       pageSize: currentPageSize,
                       showSizeChanger: true,
                   }}
                   onRow={getTaskRowProps} rowHoverable={true} showSorterTooltip={{target: "sorter-icon"}}
                   onChange={handleTableChange}/>
        </>
    );
};