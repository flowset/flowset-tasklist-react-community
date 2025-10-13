/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {renderDateTime} from "@utils/format";
import {Typography} from "antd";
import dayjs from "dayjs";

export interface TaskDueDateProps {
    value?: string | null
    emptyString?: string
}

const {Text} = Typography;

export const TaskDueDate = ({value, emptyString}: TaskDueDateProps) => {
    const isOverdue = value ? dayjs(value).isBefore(dayjs()) : false;
    return (
        <>
            {!value && emptyString && <Text>{emptyString}</Text>}
            {value && <Text type={isOverdue ? "danger" : undefined}>{renderDateTime(value, emptyString)}</Text>}
        </>
    );
};