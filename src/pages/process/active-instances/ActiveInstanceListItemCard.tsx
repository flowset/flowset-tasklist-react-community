import type {UserProcessInstance} from "@models/process.ts";
import {createStyles} from "antd-style";
import {Card, Flex, Tooltip, Typography} from "antd";
import {HourglassOutlined} from "@ant-design/icons";
import {ProcessInstanceState} from "@components/process-instance/ProcessInstanceState.tsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {renderDateTime, renderRelativeDateTime} from "@utils/format";

const {Text} = Typography;

const useStyles = createStyles(({css, token, prefixCls}, isLastCard) => ({
    descriptionContainer: css`
        width: 100%;
        color: ${token.colorTextTertiary}
    `,

    listCardItem: css`
        border-bottom: 1px solid ${token.colorBorderSecondary};
        margin-inline: 0;
        
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius:  ${isLastCard ? token.borderRadius : 0};
        border-bottom-right-radius:  ${isLastCard ? token.borderRadius : 0};

        & > .${prefixCls}-card-body {
            padding: 1.25em 2em;
        }

        &:hover {
            background-color: ${token.colorPrimaryBgHover};
            border-color: ${token.colorPrimaryBorder};
        }

        &:active {
            background-color: ${token.colorPrimaryBgHover};
        }
    `,
    stateText: css`
        margin-left: auto;
    `
}));

interface ActiveInstancesListItemCardProps {
    item: UserProcessInstance;
    isLast: boolean;
}

export const ActiveInstanceListItemCard = (props: ActiveInstancesListItemCardProps) => {
    const {item, isLast} = props;

    const {styles} = useStyles(isLast);

    return (
        <>
            <Card className={styles.listCardItem}>
                <Flex vertical={true} gap={5}>
                    <Text strong>{item.processDefinitionName}</Text>
                    <Flex align="center"
                          className={styles.descriptionContainer}
                          gap={5}>
                        <HourglassOutlined/>

                        <InstanceRelativeCreateDate date={item.startTime}/>
                        <div className={styles.stateText}>
                            {item.state && <ProcessInstanceState value={item.state}/>}
                        </div>
                    </Flex>
                </Flex>
            </Card>
        </>
    );
};

interface InstanceRelativeCreateDateProps {
    date?: string
}

const InstanceRelativeCreateDate = ({date}: InstanceRelativeCreateDateProps) => {
    const [time, setTime] = useState(() => Date.now());
    const {t: translate} = useTranslation(["processInstance"]);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 10 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    const relativeDateTime = renderRelativeDateTime(time, date);
    return <Tooltip
        title={translate("startTime", {date: renderDateTime(date)})}>
        <span>{relativeDateTime ? translate("startedAgo", {relativeDate: relativeDateTime}) : translate("startedNow")}</span>
    </Tooltip>
};