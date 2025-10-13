import {type TablePaginationConfig, type TableProps, Typography} from "antd";
import {type PaginationPayload, SortOrder, type SortPayload,} from "@models/common.ts";
import {useCallback} from "react";
import type {SorterResult} from "antd/lib/table/interface";
import {convertStringToTableSortOrder} from "@utils/sort";
import {renderDateTime} from "@utils/format";
import {ProcessInstanceState} from "@components/process-instance/ProcessInstanceState.tsx";
import {usePaginatedList} from "@hooks/usePaginatedList.ts";
import {useTranslation} from "react-i18next";
import type {ProcessInstanceFilterPayload, UserProcessInstance} from "@models/process.ts";
import {StyledTable} from "@components/table/StyledTable.tsx";

const {Text} = Typography;

type OnChange = TableProps<UserProcessInstance>["onChange"];
const defaultPagination: PaginationPayload = {
    page: 1,
    size: 10
};

interface InstanceDataTableProps {
    totalElements?: number;
    data?: UserProcessInstance[];
    loading: boolean;
    onPaginationChange: (pageData: PaginationPayload) => void;
    onSortChange: (sort?: SortPayload) => void;
}

export const InstanceDataTable = ({
                                      data,
                                      loading,
                                      onPaginationChange,
                                      onSortChange,
                                      totalElements
                                  }: InstanceDataTableProps) => {
    const {currentPageData, currentSortData} = usePaginatedList({
        defaultPagination
    });
    const {t: translate} = useTranslation(["processInstance"]);

    const handleColumnSortChange = useCallback((sorter: SorterResult<UserProcessInstance>) => {
        if (!sorter.order) {
            onSortChange(undefined);
        } else {
            const order = sorter.order === "descend" ? SortOrder.Desc : SortOrder.Asc;
            const property = sorter.field as string;

            onSortChange({order: order, property: property});
        }
    }, [onSortChange]);

    const handlePaginationChange = useCallback((pagination: TablePaginationConfig) => {
        onPaginationChange({page: pagination.current || 1, size: pagination.pageSize || 10});
    }, [onPaginationChange]);

    const handleTableChange: OnChange = useCallback((pagination: TablePaginationConfig, _filters: ProcessInstanceFilterPayload,
                                                     sorter: SorterResult<UserProcessInstance> | SorterResult<UserProcessInstance>[]) => {

        if (pagination && pagination.current !== currentPageData.page || pagination.pageSize !== currentPageData.size) {
            handlePaginationChange(pagination);
        }
        if (sorter && !Array.isArray(sorter)) {
            handleColumnSortChange(sorter);
        }
    }, [handleColumnSortChange, handlePaginationChange, currentPageData.page, currentPageData.size]);

    const tableOrder = convertStringToTableSortOrder(currentSortData?.order);

    const columns: TableProps<UserProcessInstance>["columns"] = [
        {
            title: translate("processInstance:processName"),
            dataIndex: "processName",
            key: "processName",
            sorter: true,
            render: (_, {processDefinitionName}: UserProcessInstance) =>
                <Text>{processDefinitionName}</Text>,
            sortOrder: currentSortData?.property === "processName" ? tableOrder : undefined,
            width: "35%"
        },
        {
            title: translate("processInstance:businessKey"),
            dataIndex: "businessKey",
            key: "businessKey",
            render: (_, {businessKey}: UserProcessInstance) =>
                <Text>{businessKey}</Text>,
            sorter: true,
            sortOrder: currentSortData?.property === "businessKey" ? tableOrder : undefined,
            width: "35%"
        },
        {
            title: translate("processInstance:startTime"),
            dataIndex: "startTime",
            key: "startTime",
            render: (_, {startTime}: UserProcessInstance) => <Text>{renderDateTime(startTime)}</Text>,
            sorter: true,
            sortOrder: currentSortData?.property === "startTime" ? tableOrder : undefined
        },


        {
            title: translate("processInstance:state"),
            dataIndex: "state",
            key: "state",
            render: (_, {state}: UserProcessInstance) => <ProcessInstanceState value={state}/>,
            sorter: false,
        },
    ];

    return (
        <>
            <StyledTable columns={columns} rowKey="id"
                         size="small"
                         scroll={{y: totalElements && totalElements > 5 ? "20em" : undefined}}
                         loading={loading}
                         dataSource={data}
                         pagination={{
                             position: ["topRight", "none"],
                             total: totalElements && totalElements > 0 ? totalElements : 1, //if the total is 0, pagination is hidden
                             defaultCurrent: currentPageData.page,
                             current: currentPageData.page,
                             defaultPageSize: currentPageData.size,
                             pageSize: currentPageData.size,
                             showSizeChanger: true,
                         }}
                         showSorterTooltip={{target: "sorter-icon"}}
                         onChange={handleTableChange}/>

        </>
    );
};