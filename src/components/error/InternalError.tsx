/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Result, type ResultProps} from "antd";
import {useTranslation} from "react-i18next";

export const InternalError = (props: Omit<ResultProps, "status">) => {
    const {t: translate} = useTranslation();
    const {title, subTitle, ...restProps} = props;
    return (
        <>
            <Result
                status={500}
                title={title || translate("error.500.title")}
                subTitle={subTitle || translate("error.500.description")}
                {...restProps}
            />
        </>
    );
};