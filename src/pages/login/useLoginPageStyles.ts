/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {createStyles} from 'antd-style';
import backgroundVertical from '../../assets/img/background_vertical.svg';
import backgroundW1024Horizontal from '../../assets/img/background_w1024_horizontal.svg';
import backgroundW1280Horizontal from '../../assets/img/background_w1280_horizontal.svg';
import backgroundW1440Horizontal from '../../assets/img/background_w1440_horizontal.svg';
import backgroundW1920Horizontal from '../../assets/img/background_w1920_horizontal.svg';

export const useLoginPageStyles = createStyles(({css, token, prefixCls}, loginError) => ({
    headerTitle: css`
      margin: auto !important;
    `,

    logoIcon: css`
      font-size: large;
    `,

    loginFormMainLayout: css`
        background-image: url(${backgroundVertical});
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        @media (min-width: 360px) and (orientation: portrait) {
            background-image: url(${backgroundVertical});
            background-position: center;
            background-size: cover;
        }

        @media (min-width: 640px) and (orientation: portrait) {
            background-image: url(${backgroundW1024Horizontal});
            background-size: cover;
            background-position: center;
        }

        @media (min-width: 640px) and (orientation: landscape) {
            background-image: url(${backgroundW1024Horizontal});
            background-size: cover;
            background-position: center;
        }

        @media (min-width: 1280px) and (orientation: landscape) {
            background-image: url(${backgroundW1280Horizontal});
            background-size: cover;
            background-position: left;
        }

        @media (min-width: 1440px) and (orientation: landscape) {
            background-image: url(${backgroundW1440Horizontal});
            background-size: cover;
            background-position: center;
        }

        @media (min-width: 1920px) and (orientation: landscape) {
            background-image: url(${backgroundW1920Horizontal});
            background-size: cover;
            background-position: center;
        }
    `,

    loginFormRoot: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: stretch;
        min-height: 12em;
        flex-grow: 0;
        max-width: 20em;
       
        border-radius: ${token.borderRadiusSM}px;
        background-color: ${token.colorBgContainer};
        padding: ${token.paddingXL}px;
        border-radius: ${token.borderRadiusLG}px;

        @media (min-width: 640px) and (orientation: portrait) {
            margin-top: 5em;
        }

        @media (min-width: 1280px) and (orientation: landscape) {
            margin-left: auto;
            margin-right: 5%;
        }

        @media (min-width: 1440px) and (orientation: landscape) {
            margin-left: auto;
            margin-right: 15%;
        }

        @media (min-width: 1920px) and (orientation: landscape) {
            margin-left: auto;
            margin-right: 13%;
        }

        .${prefixCls}-form {
            min-width: 20em;
        }
    `,

    passwordField: css`
        margin-bottom: 0;
    `,
    errorContainer: css`
        height: 24px;
        visibility: ${loginError ? 'visible' : 'hidden'};
        display: flex;
        align-items: center;
    `
}));