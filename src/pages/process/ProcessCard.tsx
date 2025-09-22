/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useTranslation} from "react-i18next";
import {Card, Flex, Tooltip, Typography} from "antd";
import Title from "antd/es/typography/Title";
import {
    getProcessDefinitionRecordRepresentation
} from "../../utils/record-representation/getProcessDefinitionRecordRepresentation.ts";
import {OpenStartProcessDialogButton} from "./start/OpenStartProcessDialogButton.tsx";
import {createStyles} from "antd-style";
import type {ProcessDefinition} from "../../types/common.ts";

const {Text} = Typography;

const useStyles = createStyles(({css, prefixCls, token, responsive}) => ({
    processCard: css`
        width: 100%;
        border-color: ${token.colorBorder};

        & > .${prefixCls}-card-head {
            border-bottom: none;
        }

        & > .${prefixCls}-card-head > .${prefixCls}-card-head-wrapper > .${prefixCls}-card-head-title > * {
            margin-top: 1em;
        }

        & > .${prefixCls}-card-body {
            padding-top: 0;
            padding-bottom: 1em;

            height: 10em;

            ${responsive.lg} {
                height: 8.5em;
            }
        }

        & > .${prefixCls}-card-actions {
            border-top: none;
        }
    `,

    bodyContentContainer: css`
     gap: 0.5em;
    `
    ,
    processDescription: css`
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.5em;

        ${responsive.lg} {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.5em;
        }
    `,
}));

export interface ProcessDefinitionCardProps {
    item: ProcessDefinition;
}

export const ProcessCard = ({item}: ProcessDefinitionCardProps) => {
    const {description, key} = item;
    const {t: translate} = useTranslation(["process"]);
    const {styles} = useStyles();

    const processActions = [
        <OpenStartProcessDialogButton processDefinition={item}/>
    ];

    return (
        <>
            <Card className={styles.processCard}
                  title={<Title level={5}>{getProcessDefinitionRecordRepresentation(item)}</Title>}
                  hoverable={true}
                  actions={processActions} variant={"outlined"}>

                <Flex vertical={true} wrap={true} className={styles.bodyContentContainer}>
                    <Flex gap="small">
                        <Text>{translate("key")}: </Text>
                        <Text type="secondary">{key}</Text>
                    </Flex>
                    <div className={styles.processDescription}>
                        <Text>{translate("description")}: </Text>
                        <Tooltip title={description || "-"} placement="right">
                            <Text type="secondary">{description || "-"}</Text>
                        </Tooltip>
                    </div>
                </Flex>
            </Card>
        </>
    );
};