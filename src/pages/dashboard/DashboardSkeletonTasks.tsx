/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, List, Skeleton} from "antd";
import {useListCardStyles} from "./useListCardStyles.ts";

export const DashboardSkeletonTasks = () => {
    const {styles} = useListCardStyles();
    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={[0, 1, 2, 3, 4]}
                renderItem={(_item) => (
                    <List.Item className={styles.listItem}>
                        <List.Item.Meta className={styles.listItemMeta}
                                        description={<Card
                                            className={styles.listItemCard}>
                                            <Skeleton active={true} title={false} paragraph={{rows: 2}}/>
                                        </Card>}
                        />
                    </List.Item>
                )}
            />
        </>
    );
};