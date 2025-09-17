/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import Big from "big.js";

export const countDecimals = (number: Big.BigSource) => {
    const num = Big(number);
    if (num.toString() === num.toFixed(0)) return 0;
    return num.toFixed().split('.')[1].length || 0;
};
