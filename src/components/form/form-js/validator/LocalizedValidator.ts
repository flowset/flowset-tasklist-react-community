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
import type {Field, FieldValidationRule, FieldValue} from "./types.ts";

const VALIDATE_FEEL_PROPERTIES = ["min", "max", "minLength", "maxLength"];


/**
 * Helper class to update the properties related to the form linked to the BPMN diagram element (start event, user task).
 * Ported from @bpmn-io/form-js sources.
 */
export class LocalizedValidator {
    private readonly expressionLanguage: FeelExpressionLanguage;
    private readonly formFieldRegistry: FormFieldRegistry;

    static $inject = [
        "expressionLanguage",
        "formFieldRegistry",
    ];

    constructor(expressionLanguage: FeelExpressionLanguage, formFieldRegistry: FormFieldRegistry) {
        this.expressionLanguage = expressionLanguage;
        this.formFieldRegistry = formFieldRegistry;
    }

    validateFieldInstance(fieldInstance: { id: string; expressionContextInfo: never; }, value: FieldValue) {
        const {id, expressionContextInfo} = fieldInstance;

        const field = (this.formFieldRegistry._formFields as never)[id];

        if (!field) {
            return [];
        }

        const {type, validate} = field;

        let errors: string[] = [];

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

    runNumberValidation(field: never, value: FieldValue): string[] {
        const {decimalDigits, increment} = field;
        const errors: string[] = [];

        if (value === "NaN") {
            errors.push(i18n.t("formJs:validation.notNumber"));
        } else if (value && typeof value === "number") {
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

    runPresetValidation(field: Field, validation: FieldValidationRule, value: FieldValue) {
        const errors: string[] = [];

        if (validation.required) {
            const isUncheckedCheckbox = field.type === "checkbox" && value === false;
            const isUnsetValue = isNil(value) || value === "";
            const isEmptyMultiselect = Array.isArray(value) && value.length === 0;

            if (isUncheckedCheckbox || isUnsetValue || isEmptyMultiselect) {
                errors.push(i18n.t("formJs:validation.required"));
            }
        }

        if (typeof value === "string") {
            if (validation.pattern && value && !new RegExp(validation.pattern).test(value)) {
                errors.push(validation.patternErrorMessage || i18n.t("fromJs:validation.notMatchPattern", {
                    pattern: validation.pattern
                }));
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
        }

        if (typeof value === "number") {
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
        }

        return errors;
    }

    evaluateFEELValues(validate: FieldValidationRule, expressionLanguage: FeelExpressionLanguage, expressionContextInfo: never): FieldValidationRule {
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

