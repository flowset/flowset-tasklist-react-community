/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {type ProcessDefinition} from "@models/process.ts";
import {useGetStartFormData, useStartProcess} from "@hooks/process";
import {Flex, Modal, notification, Spin, Typography} from "antd";
import {useCallback} from "react";
import {getProcessDefinitionRecordRepresentation} from "@utils/record-representation";
import {useTranslation} from "react-i18next";
import {EmbeddedForm} from "@components/form/EmbeddedForm.tsx";
import {CustomForm} from "@components/form/CustomForm.tsx";
import {CancelButton} from "@components/button/CancelButton.tsx";
import {createStyles} from "antd-style";
import {DefaultStartForm} from "./forms/DefaultStartForm.tsx";
import {StartDeployedJsonForm} from "./forms/StartDeployedJsonForm.tsx";
import {FormType} from "@models/form.ts";

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
    onProcessStart: () => void;
}

export const StartProcessDialog = ({processDefinition, open, onClose, onProcessStart}: StartProcessDialogProps) => {
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
            onProcessStart();
        }).catch((error: unknown) => {
            console.log("Error on process starting: ", error);
            api.error({
                message: translate("process:processNotStarted", {process: processRecordRepresentation}),
                placement: "top",
                duration: 3
            });
        });
    }, [api, processDefinition, startProcessAsync, translate, onProcessStart]);

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
                {formType === FormType.FORM_ENGINE_JSON && startFormData &&
                    <StartDeployedJsonForm formData={startFormData} onStart={startProcess}
                                     startInProgress={isStartInProgress}
                                     onCancel={onClose}
                    />}
                {formType === FormType.CUSTOM && startFormData &&
                    <CustomForm onSubmit={startProcess}
                                onCancel={onClose}
                                process={processDefinition}
                                formData={startFormData}/>
                }
            </Modal>
        </>
    );
};
