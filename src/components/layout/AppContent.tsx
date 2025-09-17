/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Flex} from "antd";
import {AppRoutes} from "../../routes/AppRoutes.tsx";
import {createStyles} from "antd-style";
import {useTaskSelection} from "../../hooks/user-task/useTaskSelection.ts";

const useStyles = createStyles(({css}, taskId) => ({
    contentContainer: css`
        min-height: 100%;
        position: relative;
        padding-bottom: ${taskId ? 0 : '2.5em'};
    `,
}));

export const AppContent = () => {
    const {selectedTaskId} = useTaskSelection();

    const {styles} = useStyles(selectedTaskId);
    return (
        <>
            <Flex vertical={true} className={styles.contentContainer}>
                <AppRoutes/>
            </Flex>
        </>
    );
};