export interface FieldValidationRule {
    pattern: string | RegExp;
    patternErrorMessage: string;
    required: boolean;
    min: number;
    max: number;
    minLength: number;
    maxLength: number;
    validationType: string;
}

export type FieldValue = string | number | boolean | null | undefined;

export interface Field {
    type: string;
}