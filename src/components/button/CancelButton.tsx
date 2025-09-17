/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ButtonProps} from "antd/lib";
import {Button} from "antd";
import {StopOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

export const CancelButton = (props: ButtonProps) => {
    const {t: translate} = useTranslation();
    const {icon, ...restProps} = props;
    return (
        <>
            <Button icon={icon || <StopOutlined/>} {...restProps}>
                {translate("actions.cancel")}
            </Button>
        </>
    );
};