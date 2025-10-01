/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import type {ThemeConfig} from "antd";

/**
 * Ant Design Theme configuration for OpenBPM Tasklist.
 * More information: https://ant.design/docs/react/customize-theme
 */
export const openbpmTheme: ThemeConfig = {
    cssVar: {key: "openbpm-tasklist"},
    token: {
        colorPrimary: "#3d72d6",
        colorError: "hsl(3, 85%, 48%)",

    },
    components: {
        Layout: {
            headerBg: "#3d72d6",
            triggerBg: "#2281fa",
            bodyBg: "#F0F5FF"
        },
        Menu: {
            darkItemBg: "#3d72d6",
            darkItemSelectedBg: "#043278",
            darkPopupBg: "#3d72d6",
            darkItemColor: "#fff",
            horizontalItemSelectedColor: "#fff",
            itemSelectedBg: "#043278",
        },
        Table: {
            headerBg: "#3d72d6",
            headerColor: "#fff",
            headerSortHoverBg: "#2152A7",
            bodySortBg: "#fff",
            headerSortActiveBg: "#043278",
            borderRadius: 0,
            borderColor: "#D4E3FC",
            rowSelectedBg: "rgba(61, 114, 214, 0.05)",
        }
    }
};