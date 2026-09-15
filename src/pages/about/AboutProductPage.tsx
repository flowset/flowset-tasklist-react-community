/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {useTranslation} from "react-i18next";
import {getLocalizedProductMetadata} from "./getLocalizedProductMetadata.ts";
import {Card, Divider, Flex, Row, Space, Typography} from "antd";
import Col from "antd/es/grid/col";
import {createStyles} from "antd-style";
import {ExternalLinkListItem} from "./components/ExternalLinkListItem.tsx";
import {ProductItem} from "./components/ProductItem.tsx";
import {getEnv} from "@utils/env";

const {Title, Text} = Typography;

const APP_VERSION = getEnv("VITE_APP_VERSION");
const APP_BUILD_SOURCE = getEnv("VITE_APP_BUILD_SOURCE", "sources");

const useStyles = createStyles(({css, prefixCls, responsive}) => ({
    pageRoot: css`
        justify-content: center;
        flex-grow: 1;
        padding: 2em 1em 0 2em;
        display: flex;
        height: 100%;
        width: 100%;
    `,
    layoutRoot: css`
        height: min-content;
        width: 100%;
        padding-inline: 2em;
    `,

    propertiesCard: css`
        height: 100%;
        width: 100%;

        & > .${prefixCls}-card-head {
            border-bottom: none;
        }

        & > .${prefixCls}-card-body {
            padding-top: 0;
        }
    `,
    cardTitle: css`
        margin: 0 !important;
    `,
    responsiveFlex: css`
        width: 100%;
        height: 100%;
        flex-direction: column;

        & > .${prefixCls}-card:first-child {
            height: min-content;

            ${responsive.md} {
                height: 100%;
            }
        }

        ${responsive.md} {
            flex-direction: row;
        }

        ${responsive.xs} {
            flex-direction: column;
        }
    `,
    externalLinksContainer: css`
        width: 100%;
    `,
    productDivider: css`
        width: 100%;
    `
}));

export const AboutProductPage = () => {
    const {t: translate, i18n} = useTranslation(["aboutProduct"]);
    const productMetadata = getLocalizedProductMetadata(i18n.language);

    const {styles} = useStyles();
    return (
        <>
            <div className={styles.pageRoot}>
                <Row gutter={[0, 10]}
                     className={styles.pageRoot}>
                    <Col xs={24} sm={24} md={19} xl={18} xxl={16}>
                        <Flex vertical={true} className={styles.layoutRoot} gap={10}>
                            <Row gutter={[10, 20]} className={styles.layoutRoot}>
                                <Col xs={24} sm={24} md={24} xl={8} xxl={8}>
                                    <Flex className={styles.responsiveFlex} gap={"middle"}>
                                        <Card className={styles.propertiesCard}
                                              title={<Title level={4}
                                                            className={styles.cardTitle}
                                                            copyable={{
                                                                tooltips: false,
                                                                text: `Flowset Tasklist ${APP_VERSION} (${APP_BUILD_SOURCE})`
                                                            }}>{translate("productVersion.title")}</Title>}>
                                            <Space orientation={"vertical"} size={"middle"}>
                                                <Space align={"baseline"}>
                                                    <Text>{translate("product.label")}: </Text>
                                                    <Text type={"secondary"}>Flowset Tasklist</Text>
                                                </Space>
                                                <Space align={"baseline"}>
                                                    <Text>{translate("version.label")}: </Text>
                                                    <Text type={"secondary"}>{APP_VERSION}</Text>
                                                </Space>
                                                <Space align={"baseline"}>
                                                    <Text>{translate("build.label")}: </Text>
                                                    <Text type={"secondary"}>{APP_BUILD_SOURCE}</Text>
                                                </Space>
                                            </Space>

                                        </Card>

                                        <Card className={styles.propertiesCard}
                                              title={<Title level={4}
                                                            className={styles.cardTitle}>
                                                  {translate("externalLinks.title")}</Title>}>
                                            <Space orientation={"vertical"} size={"middle"}
                                                   className={styles.externalLinksContainer}>
                                                {productMetadata.externalLinks.map((link, index) => (
                                                    <ExternalLinkListItem item={link} key={index}/>
                                                ))}
                                            </Space>

                                        </Card>
                                    </Flex>

                                </Col>
                                <Col xs={24} sm={24} md={24} xl={16} xxl={16}>
                                    <Card className={styles.propertiesCard}
                                          title={<Title level={4}
                                                        className={styles.cardTitle}>
                                              {translate("ourProducts.title")}</Title>}>
                                        <Space orientation={"vertical"} style={{
                                            width: "100%"
                                        }}>
                                            {productMetadata.products.map((product, index) => (
                                                <>
                                                    <ProductItem item={product}/>
                                                    {(index < productMetadata.products.length - 1) &&
                                                        <Divider size={"small"} className={styles.productDivider}/>}
                                                </>

                                            ))}
                                        </Space>

                                    </Card>
                                </Col>
                            </Row>
                        </Flex>

                    </Col>
                </Row>

            </div>


        </>
    );
};