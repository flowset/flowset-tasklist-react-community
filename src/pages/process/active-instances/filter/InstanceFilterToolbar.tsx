import type {ProcessInstanceFilterPayload} from "@models/process.ts";
import {useCallback} from "react";
import {Flex} from "antd";
import {InstanceFilterForm} from "./InstanceFilterForm.tsx";
import type {InstanceFilterFormData} from "./types.ts";
import {createInstanceFilter} from "./createInstanceFilter.ts";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css, token}) => ({
    rootContainer: css`
        width: 100%;
        margin-bottom: ${token.marginMD}px
    `
}));
export interface InstanceFilterToolbarProps {
    onApply: (taskFilters: ProcessInstanceFilterPayload) => void;
    onReset: () => void;
}

export const InstanceFilterToolbar = ({onReset, onApply}: InstanceFilterToolbarProps) => {
    const {styles} = useStyles();

    const handleFilterApply = useCallback((instanceFilters: InstanceFilterFormData) => {
        const instanceFilter = createInstanceFilter(instanceFilters);
        if (instanceFilter) {
            onApply(instanceFilter);
        } else {
            onReset();
        }

    }, [onApply, onReset]);

    const handleFilterReset = useCallback(() => {
        onReset();
    }, [onReset]);


    return (
        <>
            <Flex className={styles.rootContainer} vertical={true}>
                <InstanceFilterForm onApply={handleFilterApply} onReset={handleFilterReset}/>
            </Flex>
        </>
    );
};