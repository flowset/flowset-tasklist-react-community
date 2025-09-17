/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {FeelExpressionLanguage, FormFieldRegistry, runExpressionEvaluation} from "@bpmn-io/form-js-viewer";
import {get, isNil, set} from "min-dash";
import {countDecimals} from "./number-utils.ts";
import Big from "big.js";
import i18n from "i18next";
import parsePhoneNumberFromString from "libphonenumber-js";
import validator from "validator";

const VALIDATE_FEEL_PROPERTIES = ["min", "max", "minLength", "maxLength"];


/**
 * Helper class to update the properties related to the form linked to the BPMN diagram element (start event, user task).
 */
export class LocalizedValidator {
    private expressionLanguage: FeelExpressionLanguage;
    private formFieldRegistry: FormFieldRegistry;

    static $inject = [
        "expressionLanguage",
        "formFieldRegistry",
    ];

    constructor(expressionLanguage: FeelExpressionLanguage, formFieldRegistry: FormFieldRegistry) {
        this.expressionLanguage = expressionLanguage;
        this.formFieldRegistry = formFieldRegistry;
    }

    validateFieldInstance(fieldInstance: { id: any; expressionContextInfo: any; }, value: any) {
        const {id, expressionContextInfo} = fieldInstance;

        const field = (this.formFieldRegistry._formFields as any)[id]; //TODO:

        if (!field) {
            return [];
        }

        const {type, validate} = field;

        let errors: any[] = [];

        if (type === "number") {
            errors = [...errors, ...this.runNumberValidation(field, value)];
        }

        if (!validate) {
            return errors;
        }

        const evaluatedValidation = this.evaluateFEELValues(validate, this.expressionLanguage, expressionContextInfo);

        errors = [...errors, ...this.runPresetValidation(field, evaluatedValidation, value)];

        return errors;
    }

    runNumberValidation(field: any, value: any) {
        const {decimalDigits, increment} = field;
        const errors = [];

        if (value === "NaN") {
            errors.push(i18n.t("formJs:validation.notNumber"));
        } else if (value) {
            if (decimalDigits >= 0 && countDecimals(value) > decimalDigits) {
                errors.push(
                    decimalDigits === 0 ? i18n.t("formJs:validation.invalidDigits.zero")
                        : i18n.t("formJs:validation.invalidDigits.incorrectCount", {decimalDigits})
                );
            }

            if (increment) {
                const bigValue = Big(value);
                const bigIncrement = Big(increment);

                const offset = bigValue.mod(bigIncrement);

                if (offset.cmp(0) !== 0) {
                    const previousValue = bigValue.minus(offset);
                    const nextValue = previousValue.plus(bigIncrement);

                    errors.push(i18n.t("formJs:validation.invalidIncrement", {
                        previousValue,
                        nextValue
                    }));
                }
            }
        }

        return errors;
    }

    runPresetValidation(field: { type: string; }, validation: {
        pattern: string | RegExp;
        patternErrorMessage: any;
        required: any;
        min: number;
        max: number;
        minLength: number;
        maxLength: number;
        validationType: string;
    }, value: any) {
        const errors = [];

        if (validation.pattern && value && !new RegExp(validation.pattern).test(value)) {
            errors.push(validation.patternErrorMessage || i18n.t("fromJs:validation.notMatchPattern", {
                pattern: validation.pattern
            }));
        }

        if (validation.required) {
            const isUncheckedCheckbox = field.type === "checkbox" && value === false;
            const isUnsetValue = isNil(value) || value === "";
            const isEmptyMultiselect = Array.isArray(value) && value.length === 0;

            if (isUncheckedCheckbox || isUnsetValue || isEmptyMultiselect) {
                errors.push(i18n.t("formJs:validation.required"));
            }
        }

        if ("min" in validation && (value || value === 0) && value < validation.min) {
            errors.push((i18n.t("formJs:validation.minValue", {
                minValue: validation.min,
            })));
        }

        if ("max" in validation && (value || value === 0) && value > validation.max) {
            errors.push((i18n.t("formJs:validation.maxValue", {
                maxValue: validation.max,
            })));
        }

        if ("minLength" in validation && value && value.trim().length < validation.minLength) {
            errors.push(i18n.t("formJs:validation.minLength", {
                minLength: validation.minLength,
            }));
        }

        if ("maxLength" in validation && value && value.trim().length > validation.maxLength) {
            errors.push(i18n.t("formJs:validation.maxLength", {
                maxLength: validation.maxLength,
            }));
        }

        if ("validationType" in validation && value && validation.validationType === "phone") {
            const phoneNumber = parsePhoneNumberFromString(value);
            if (!phoneNumber || !phoneNumber.isValid()) {
                errors.push(i18n.t("formJs:validation.invalidPhoneNumber"));
            }
        }

        if ("validationType" in validation && value && validation.validationType === "email" && !validator.isEmail(value)) {
            errors.push(i18n.t("formJs:validation.invalidEmail"));
        }

        return errors;
    }

    evaluateFEELValues(validate: any, expressionLanguage: FeelExpressionLanguage, expressionContextInfo: any) {
        const evaluatedValidate = {...validate};

        VALIDATE_FEEL_PROPERTIES.forEach((property) => {
            const path = property.split(".");
            const value = get(evaluatedValidate, path);
            const evaluatedValue = runExpressionEvaluation(expressionLanguage, value, expressionContextInfo);
            set(evaluatedValidate, path, evaluatedValue === null ? undefined : evaluatedValue);
        });

        return evaluatedValidate;
    }
}

