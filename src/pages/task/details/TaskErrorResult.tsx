/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useTranslation} from "react-i18next";
import {NotFoundError} from "@components/error/NotFoundError.tsx";
import {AccessDeniedError} from "@components/error/AccessDeniedError.tsx";
import {InternalError} from "@components/error/InternalError.tsx";

interface ErrorResultProps {
    error: unknown
}

export const TaskErrorResult = ({error}: ErrorResultProps) => {
    const {t: translate} = useTranslation(["common", "userTask"]);
    const status = typeof error === "object" ? (error as Record<string, unknown>)["status"] : undefined;
    return (
        <>
            {status === 404 && <NotFoundError title={translate("userTask:detailPage.error.taskNotFound.title")}
                                              subTitle={translate("userTask:detailPage.error.taskNotFound.description")}/>
            }
            {status === 403 && <AccessDeniedError/>}
            {(status !== 404 && status !== 403) && <InternalError
                subTitle={translate("userTask:detailPage.error.internalError.description")}
            />
            }
        </>
    );
};