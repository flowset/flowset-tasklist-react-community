/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {FormType, type ProcessDefinition} from "../../../types/common.ts";
import {useGetStartFormData} from "../../../hooks/process/useGetStartFormData.ts";
import {useStartProcess} from "../../../hooks/process/useStartProcess.ts";
import {Flex, Modal, notification, Spin, Typography} from "antd";
import {useCallback} from "react";
import {
    getProcessDefinitionRecordRepresentation
} from "../../../utils/record-representation/getProcessDefinitionRecordRepresentation.ts";
import {useTranslation} from "react-i18next";
import {EmbeddedForm} from "../../../components/form/EmbeddedForm.tsx";
import {CustomForm} from "../../../components/form/CustomForm.tsx";
import {CancelButton} from "../../../components/button/CancelButton.tsx";
import {createStyles} from "antd-style";
import {DefaultStartForm} from "./forms/DefaultStartForm.tsx";
import {StartFormJsForm} from "./forms/StartFormJsForm.tsx";

const {Title} = Typography;

const useStyles = createStyles(({css, prefixCls}) => ({
    emptyModalFooter: css`
        & > .${prefixCls}-modal-footer {
            margin: 0;
        }

    `,
    modalTitle: css`
        margin-top: 0
    `,
    formContainer: css`
        width: 100%;
    `,
    cancelButton: css`
        width: min-content;
    `,
}));

export interface StartProcessDialogProps {
    processDefinition: ProcessDefinition;
    open: boolean;
    onClose: () => void;
}

export const StartProcessDialog = ({processDefinition, open, onClose}: StartProcessDialogProps) => {
    const {t: translate} = useTranslation(["process"]);
    const [api, contextHolder] = notification.useNotification();

    const {mutateAsync: startProcessAsync, isPending: isStartInProgress} = useStartProcess({
        processDefinitionId: processDefinition.id
    });

    const {data: startFormData, isError: isFormDataError, isLoading: isFormLoading} = useGetStartFormData({
        processDefinitionId: processDefinition.id
    }, {
        enabled: open
    });

    const {styles} = useStyles();

    const startProcess = useCallback(async (variables?: Record<string, unknown>, businessKey?: string): Promise<void> => {
        const processRecordRepresentation = getProcessDefinitionRecordRepresentation(processDefinition);
        await startProcessAsync({
            businessKey,
            variables
        }).then(() => {
            api.success({
                message: translate("process:processStarted", {process: processRecordRepresentation}),
                placement: "top",
                duration: 3
            });
            onClose();
        }).catch((error: any) => {
            console.log("Error on process starting: ", error);
            api.error({
                message: translate("process:processNotStarted", {process: processRecordRepresentation}),
                placement: "top",
                duration: 3
            });
        });
    }, [api, processDefinition, startProcessAsync, onClose, translate]);

    const formType = startFormData?.type;
    const showDefaultForm = !startFormData;
    return (
        <>
            {contextHolder}
            <Modal open={open} onCancel={onClose}
                   footer={[]}
                   className={styles.emptyModalFooter}
                   title={<Title level={4}
                                 className={styles.modalTitle}>{translate("process:startDialog.title")}</Title>}>
                {isFormLoading && <Spin/>}
                {!isFormDataError && !isFormLoading && showDefaultForm && <DefaultStartForm
                    onStart={startProcess}
                    onCancel={onClose}
                    startInProgress={isStartInProgress}
                />

                }
                {formType == FormType.EMBEDDED && <Flex vertical={true} gap="middle" className={styles.formContainer}>
                    <EmbeddedForm/>
                    <CancelButton onClick={onClose} className={styles.cancelButton}/>
                </Flex>}
                {formType === FormType.FORM_JS_JSON && startFormData &&
                    <StartFormJsForm formData={startFormData} onStart={startProcess}
                                     startInProgress={isStartInProgress}
                                     onCancel={onClose}
                    />}
                {formType === FormType.CUSTOM &&
                    <CustomForm onSubmit={startProcess}
                                onCancel={onClose}
                                process={processDefinition}
                                formData={startFormData!!}/>
                }
            </Modal>
        </>
    );
};
