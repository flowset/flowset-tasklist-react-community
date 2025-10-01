/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Tag} from "antd";
import {useTranslation} from "react-i18next";

interface TaskPriorityProps {
    value: number | string;
}

export const TaskPriority = ({value}: TaskPriorityProps) => {
    const priorityKey = typeof value === "number" ? getPriorityKey(value) : value;
    const {t: translate} = useTranslation(["common"]);
    return (
        <>
            {priorityKey === "low" && <Tag>{translate("priority.low")}</Tag>}
            {priorityKey === "normal" && <Tag color="green">{translate("priority.normal")}</Tag>}
            {priorityKey === "high" && <Tag color="warning">{translate("priority.high")}</Tag>}
        </>
    );
};

const getPriorityKey = (priority: number) => {
    if (priority < 40) {
        return "low";
    }
    if (priority >= 40 && priority < 60) {
        return "normal";
    }

    if (priority >= 60) {
        return "high"
    }
};