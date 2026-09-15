/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {notification, Row} from "antd";
import Col from "antd/es/grid/col";
import {useCallback, useState} from "react";
import {UserTaskList} from "./list/UserTaskList.tsx";
import {UserTaskDetails} from "./details/UserTaskDetails.tsx";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";
import {useTaskSelection} from "@hooks/user-task";
import type {UserTask} from "@models/user-task.ts";

const useStyles = createStyles(({css}, selectedTaskId) => {
    return {
        rootGrid: css`
            height: 100%;
            justify-content: center;
            flex-grow: 1;
        `,

        listContainer: css`
            padding: 2em 1em ${selectedTaskId ? "2.5em" : 0} 2em;
        `
    }
});

export const UserTasksPage = () => {
    const {selectedTaskId, selectTask, resetTask} = useTaskSelection();
    const [lastCompletedTask, setLastCompletedTask] = useState<string>();
    const [api, contextHolder] = notification.useNotification();
    const {t: translate} = useTranslation(["userTask"]);
    const {styles} = useStyles(
        selectedTaskId
    );

    const handleTaskComplete = (task: UserTask) => {
        resetTask();
        api.success({
            title: translate("listPage.taskCompleted", {taskName: task?.name}),
            placement: "top",
            duration: 3
        });
        setLastCompletedTask(task.id);
    };

    const handleErrorOnTaskListLoad = useCallback(() => {
        resetTask();
    }, [resetTask]);

    return (
        <>
            {contextHolder}
            <Row className={styles.rootGrid}>
                <Col xs={selectedTaskId ? 0 : 24}
                     sm={selectedTaskId ? 0 : 24}
                     md={selectedTaskId ? 10 : 19}
                     xl={selectedTaskId ? 10 : 18}
                     xxl={selectedTaskId ? 10 : 16}
                     className={styles.listContainer}>
                    <UserTaskList onTaskSelection={selectTask}
                                  lastCompletedTask={lastCompletedTask}
                                  onError={handleErrorOnTaskListLoad}/>
                </Col>
                {selectedTaskId && <Col xs={24} sm={24} md={14} xl={14}>
                    <UserTaskDetails taskId={selectedTaskId}
                                     onTaskClose={resetTask}
                                     onTaskComplete={handleTaskComplete}/>
                </Col>}
            </Row>
        </>
    );
};