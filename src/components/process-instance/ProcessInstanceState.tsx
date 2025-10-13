/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Tag} from "antd";
import {useTranslation} from "react-i18next";

interface ProcessInstanceStateProps {
    value?: string
}

export const ProcessInstanceState = ({value}: ProcessInstanceStateProps) => {
    const {t} = useTranslation(["processInstance"]);
    if (!value) {
        return null;
    }
    return (
        <>
            {value === "ACTIVE" && <Tag color={"success"}>{t("state.active")}</Tag>}
            {value === "SUSPENDED" && <Tag color="warning">{t("state.suspended")}</Tag>}
        </>
    );
};