/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Result, type ResultProps} from "antd";
import {useTranslation} from "react-i18next";

export const NotFoundError = (props: Omit<ResultProps, "status">) => {
    const {t: translate} = useTranslation();
    const {title, subTitle, ...restProps} = props;
    return (
        <>
            <Result
                status={404}
                title={title || translate("error.404.title")}
                subTitle={subTitle || translate("error.404.description")}
                {...restProps}
            />
        </>
    );
};