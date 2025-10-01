/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Drawer, Row, Skeleton} from "antd";
import Col from "antd/es/grid/col";
import {TaskFormCard} from "./TaskFormCard.tsx";
import {TaskSystemInfoCard} from "./TaskSystemInfoCard.tsx";
import Title from "antd/es/typography/Title";
import type {DrawerStyles} from "antd/es/drawer/DrawerPanel";
import {TaskErrorResult} from "./TaskErrorResult.tsx";
import {useGetUserTaskData} from "@hooks/user-task";
import {createStyles} from "antd-style";
import type {UserTask} from "@models/user-task.ts";

const drawerStyles: DrawerStyles = {
    wrapper: {
        width: "100%"
    },
    body: {
        padding: 0,
        scrollbarWidth: "thin"
    }
};
const loadingDrawerStyles: DrawerStyles = {
    wrapper: {
        width: "100%"
    },
};


const useStyles = createStyles(({css}) => ({
    drawer: css`
        margin-top: 0;
        margin-bottom: 0.1em;
    `,

    rootGrid: css`
        width: 100%;
        height: 100%;
        padding-inline: 1em;
        padding-top: 1em;
    `,

}));

export interface UserTaskDetailsProps {
    onTaskClose: () => void;
    onTaskComplete: (task: UserTask) => void;
    taskId: string;
}

export const UserTaskDetails = ({
                                    onTaskClose,
                                    taskId: recordId,
                                    onTaskComplete
                                }: UserTaskDetailsProps) => {

    const {task, form, initialData, isLoading, error} = useGetUserTaskData({
        taskId: recordId
    });
    const {styles} = useStyles();
    if (error) {
        return <TaskErrorResult error={error}/>
    }

    return (
        <>
            <Drawer title={<Title level={4} className={styles.drawer}>{task?.name}</Title>}
                    open={true} getContainer={false} loading={isLoading}
                    onClose={onTaskClose} styles={isLoading ? loadingDrawerStyles : drawerStyles}>
                <Row gutter={[{xs: 5, sm: 6, md: 6, xl: 6, xxl: 6}, {xs: 8, sm: 8, md: 8, xl: 3, xxl: 3}]}
                     className={styles.rootGrid}>
                    <Col xs={24} sm={24} md={24} xl={16}>
                        {!isLoading ? <TaskFormCard task={task} formData={form} initialData={initialData}
                                                    onTaskCompleteSuccess={onTaskComplete}
                                                    onTaskClose={onTaskClose}/> : <Card>
                            <Skeleton loading={true} active>
                                <div/>
                            </Skeleton>
                        </Card>
                        }
                    </Col>
                    <Col xs={24} sm={24} md={24} xl={8}>
                        <TaskSystemInfoCard task={task} loading={isLoading}/>
                    </Col>
                </Row>
            </Drawer>
        </>
    );
};
