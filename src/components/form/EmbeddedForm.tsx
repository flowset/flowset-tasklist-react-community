/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Flex, theme, Typography} from "antd";
import {useBpmEngine} from "@hooks/useBpmEngine.ts";
import {useTranslation} from "react-i18next";
import {WarningFilled} from "@ant-design/icons";

const {Link, Title} = Typography;

/**
 * A component to show an embedded task or start form.
 * <strong>Note: </strong>Embedded form not supported in Flowset Tasklist.
 * @constructor
 */
export const EmbeddedForm = () => {
    const bpmEngine = useBpmEngine();
    const {t: translate} = useTranslation();
    const {token: {colorWarning}} = theme.useToken();
    return (
        <>
            <Flex vertical={true} align={"center"} justify={"center"} style={{
                width: "100%",
            }}
            >
                <Title level={5} style={{margin: 0}}> <WarningFilled style={{
                    color: colorWarning,
                }}/> {translate("embeddedFormsNotSupported")}</Title>
                {bpmEngine && bpmEngine.webAppsUrl && <Link href={bpmEngine.webAppsUrl} target="_blank">
                    {translate("openEngineWebApps")}
                </Link>
                }
            </Flex>

        </>
    );
};