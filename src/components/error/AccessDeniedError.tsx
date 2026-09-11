/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Result, type ResultProps} from "antd";
import {useTranslation} from "react-i18next";

export const AccessDeniedError = (props: Omit<ResultProps, "status">) => {
    const {t: translate} = useTranslation();
    const {title, subTitle, ...restProps} = props;
    return (
        <>
            <Result
                status={403}
                title={title || translate("error.403.title")}
                subTitle={subTitle || translate("error.403.description")}
                {...restProps}
            />
        </>
    );
};
