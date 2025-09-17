/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Badge, Collapse, type CollapseProps, Flex, Typography} from "antd";
import {TaskFilterForm} from "./TaskFilterForm.tsx";
import {createTaskFilter} from "./createTaskFilter.ts";
import {useCallback, useState} from "react";
import {FilterFilled, RightOutlined} from "@ant-design/icons";
import type {TaskFilterFormData} from "./types.ts";
import {useTranslation} from "react-i18next";
import {useTaskFilterCount} from "../../../../hooks/user-task/useTaskFilterCount.ts";
import {createStyles} from "antd-style";
import type {TaskFilterPayload} from "../../../../types/common.ts";

const {Title} = Typography;

const useStyles = createStyles(({css, token}, isExpanded) => {
    return {
        rootContainer: css`
            width: 100%;
        `,
        filterTitle: css`
            margin: 0!important;
        `,

        filterIcon: css`
            height: 100%;
            margin-top: 0.1em;
            color: ${isExpanded ? token.colorTextTertiary : token.colorPrimary}
        `,
        collapseIcon: css`
            margin-top: 0.3em;
            width: 0.6em;
            height: 0.6em;
            color: ${token.colorTextSecondary};
            rotate: ${isExpanded ? 0 : 90};
        `,
        filterCountBadge: css`
            color: ${token.colorInfoTextHover};
            box-shadow: none;
        `
    }
});

export interface TaskFilterToolbarProps {
    onApply: (taskFilters: TaskFilterPayload) => void;
    onReset: () => void;
}

export const TaskFilterToolbar = ({onReset, onApply}: TaskFilterToolbarProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const [filterValues, setFilterValues] = useState<TaskFilterFormData>();
    const {styles} = useStyles();

    const handleFilterApply = useCallback((taskFilters: TaskFilterFormData) => {
        setFilterValues(taskFilters);
        const taskFilter = createTaskFilter(taskFilters);
        if (taskFilter) {
            onApply(taskFilter);
        } else {
            onReset();
        }

    }, [onApply, onReset]);

    const handleFilterReset = useCallback(() => {
        setFilterValues(undefined);
        onReset();
    }, [onReset]);

    const handleToggle = useCallback((key: string | string[]) => {
        setIsExpanded(!key || key.length === 0);
    }, []);

    const collapseItems: CollapseProps["items"] = [
        {
            key: "filters",
            label: <FilterHeader isExpanded={isExpanded} filterValues={filterValues}/>,
            showArrow: false,
            children: (
                <TaskFilterForm
                    onApply={handleFilterApply}
                    onReset={handleFilterReset}
                />
            )
        }
    ];
    return (
        <>
            <Collapse className={styles.rootContainer}
                      activeKey={isExpanded ? ["filters"] : []}
                      onChange={handleToggle} items={collapseItems}/>
        </>
    );
};

interface FilterHeaderProps {
    isExpanded: boolean;
    filterValues?: TaskFilterFormData;
}

const FilterHeader = ({filterValues, isExpanded}: FilterHeaderProps) => {
    const {t: translate} = useTranslation(["userTask"]);

    const filterCount = useTaskFilterCount(filterValues)();
    const hasActiveFilters = filterValues && filterCount !== undefined && filterCount > 0;
    const {styles} = useStyles(isExpanded);

    return (
        <>
            <Flex align="center" gap={5} vertical={false} wrap={true} justify="flex-start">
                <FilterFilled className={styles.filterIcon}/>
                <Title level={5} className={styles.filterTitle}>{translate("listPage.filter.header")}</Title>
                {hasActiveFilters &&
                    <Badge count={filterCount} className={styles.filterCountBadge}/>}
                <RightOutlined className={styles.collapseIcon}/>
            </Flex>
        </>
    );
};