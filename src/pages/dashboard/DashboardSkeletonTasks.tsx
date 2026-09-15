/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Card, Listy, Skeleton} from "antd";
import {useListCardStyles} from "./useListCardStyles.ts";

export const DashboardSkeletonTasks = () => {
    const {styles} = useListCardStyles();
    return (
        <>
            <Listy
                items={[0, 1, 2, 3, 4]}
                rowKey={(item) => item}
                classNames={{item: styles.listItem}}
                itemRender={() => (
                    <div className={styles.listItemMeta}>
                        <Card className={styles.listItemCard}>
                            <Skeleton active={true} title={false} paragraph={{rows: 2}}/>
                        </Card>
                    </div>
                )}
            />
        </>
    );
};