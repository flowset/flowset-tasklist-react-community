/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ButtonProps} from "antd/lib";
import {Button} from "antd";
import {PlayCircleOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

export const StartProcessButton = (props: ButtonProps) => {
    const {t: translate} = useTranslation("process");
    const {icon, ...restProps} = props;
    return (
        <>
            <Button icon={icon || <PlayCircleOutlined/>} {...restProps}>
                {translate("actions.start")}
            </Button>
        </>
    );
};