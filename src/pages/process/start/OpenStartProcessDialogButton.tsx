/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {PlayCircleOutlined} from "@ant-design/icons";
import {useCallback, useState} from "react";
import {StartProcessDialog} from "./StartProcessDialog.tsx";
import {useTranslation} from "react-i18next";
import {createStyles} from "antd-style";
import type {ProcessDefinition} from "@models/process.ts";
import {Button} from "antd";

const useStyles = createStyles(({css}) => ({
    startProcessButton: css`
        float: left;
        margin-left: 1em;
    `,
}));

interface OpenStartProcessDialogButtonProps {
    processDefinition: ProcessDefinition;
    onProcessStartSuccess?: () => void;
}

export const OpenStartProcessDialogButton = ({
                                                 processDefinition,
                                                 onProcessStartSuccess
                                             }: OpenStartProcessDialogButtonProps) => {
    const [open, setOpen] = useState(false);
    const {t: translate} = useTranslation(["process"]);
    const {styles} = useStyles();


    const handleStartClick = useCallback(() => setOpen(true), []);
    const handleDialogClose = useCallback(() => setOpen(false), []);
    const handleProcessStart = useCallback(() => {
        if (onProcessStartSuccess) {
            onProcessStartSuccess();
        }
        handleDialogClose();
    }, [onProcessStartSuccess, handleDialogClose]);

    return (
        <>
            <Button type="primary" icon={<PlayCircleOutlined/>} className={styles.startProcessButton}
                    onClick={handleStartClick}>{translate("listPage.startProcess")}</Button>
            <StartProcessDialog processDefinition={processDefinition} open={open} onClose={handleDialogClose}
                                onProcessStart={handleProcessStart}/>
        </>
    );
};

