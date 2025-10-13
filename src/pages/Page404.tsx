/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import Button from "antd/es/button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {NotFoundError} from "@components/error/NotFoundError.tsx";

export const Page404 = () => {
    const navigate = useNavigate();
    const {t: translate} = useTranslation();
    return (
        <>
            <NotFoundError
                title="404"
                subTitle={translate("common:page404.subtitle")}
                extra={
                    <Button type="primary" onClick={() => navigate(-1)}>
                        {translate("backBtn.text")}
                    </Button>
                }
            />
        </>
    );
};