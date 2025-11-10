/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ThemeConfig} from "antd";

/**
 * Ant Design Theme configuration for Flowset Tasklist.
 * More information: https://ant.design/docs/react/customize-theme
 */
export const flowsetTheme: ThemeConfig = {
    cssVar: {key: "flowset-tasklist"},
    token: {
        colorPrimary: "#176278",
        colorPrimaryBg: "rgba(23, 98, 120, 0.1)",
        colorPrimaryBgHover: "rgba(23, 98, 120, 0.075)",
        colorPrimaryBorder: "rgba(23, 98, 120, 0.3)",
        colorPrimaryBorderHover: "#396770",
        colorPrimaryHover: "#235763",
        colorPrimaryActive: "#072530",
        colorPrimaryTextHover: "#235763",
        colorPrimaryText: "#104656",
        colorPrimaryTextActive: "#072530",

        colorSuccessBg: "rgba(54, 157, 85, 0.1)",
        colorSuccessBgHover: "rgba(54, 157, 85, 0.15)",
        colorSuccessBorder: "#a1c4a8",
        colorSuccessBorderHover: "#79b888",
        colorSuccessHover: "#79b888",
        colorSuccess: "#369d55",
        colorSuccessActive: "#23783f",
        colorSuccessTextHover: "#55ab6c",
        colorSuccessText: "#369d55",
        colorSuccessTextActive: "#23783f",

        colorWarning: "#bf8600",
        colorWarningBg: "#fffce6",
        colorWarningBgHover: "#fff3a3",
        colorWarningBorder: "#ffe97a",
        colorWarningBorderHover: "#ffdc52",
        colorWarningHover: "#ffdc52",
        colorWarningActive: "hsl(32, 100%, 30%)",
        colorWarningTextHover: "#f2c327",
        colorWarningText: "hsl(32, 100%, 30%)",
        colorWarningTextActive: "#bf8600",

        colorError: "rgb(212, 44, 44)",
        colorErrorBg: "#fff2f0",
        colorErrorBgHover: "#ffded9",
        colorErrorBorderHover: "#ed857e",
        colorErrorHover: "#e05853",
        colorErrorActive: "#ad1c21",
        colorErrorTextHover: "#e05853",
        colorErrorText: "#d42c2c",
        colorErrorTextActive: "#ad1c21",

        colorInfo: "rgb(23, 98, 120)",
        colorInfoBg: "rgba(23, 98, 120, 0.1)",
        colorInfoBorder: "rgba(23, 98, 120, 0.3)",
        colorInfoText: "rgb(23, 98, 120)",

        colorLink: "rgb(23, 98, 120)",
        colorLinkHover: "rgb(45, 130, 155)"
    },
    components: {
        Layout: {
            headerBg: "rgb(16, 70, 86)",
            triggerBg: "rgb(25, 110, 140)",
            bodyBg: "rgb(242, 246, 249)"
        },
        Button: {
            defaultActiveBorderColor: "rgb(23, 98, 120)",
            defaultActiveColor: "rgb(23, 98, 120)",
            defaultHoverBg:  "rgba(23, 98, 120, 0.1)",
            defaultActiveBg: "rgba(23, 98, 120, 0.2)",

            defaultHoverBorderColor:  "rgb(25, 110, 140)",
            groupBorderColor:  "rgb(25, 110, 140)",
        },
        Menu: {
            darkItemBg: "rgb(16, 70, 86)",
            darkItemSelectedBg: "rgb(35, 110, 130)",
            darkPopupBg: "rgb(16, 70, 86)",
            darkItemColor: "#fff",
            horizontalItemSelectedColor: "#fff",
            itemSelectedBg: "rgb(35, 110, 130)",
            itemSelectedColor: "#fff"
        },
        Table: {
            headerBg: "rgb(23, 98, 120)",
            headerColor: "#fff",
            headerSortHoverBg: "rgb(25, 110, 140)",
            bodySortBg: "#fff",
            headerSortActiveBg: "rgb(45, 130, 155)",
            borderRadius: 0,
            rowSelectedBg: "rgba(61, 114, 214, 0.05)",
        }
    }
};