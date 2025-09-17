/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

type FormJsFormComponent = ComponentMap[keyof ComponentMap];
type FormComponentModel = unknown;

interface ComponentMap {
    TextField: TextFieldModel;
    TextArea: TextAreaModel;
    Number: NumberModel;
    DateTime: DateTimeModel;

    CheckBox: CheckBoxModel;
    TagList: TagListModel;
    Select: SelectModel;
    CheckList: CheckListModel;
    Radio: RadioModel;

    Group: GroupModel;
    Spacer: SpacerModel;

    Button: ButtonModel;

    Image: ImageModel;
    Text: TextModel;

    [key: string]: FormComponentModel;
}

export interface FormJsFormSchema {
    id: string;
    components?: FormJsFormComponent[];
    type: string;
    executionPlatform: string;
    executionPlatformVersion: string;
    mappedEntity?: string;
    key?: string;

    [key: string] : unknown;
}


export enum ComponentType {
    //Basic
    TextField = "textfield",
    TextArea = "textarea",
    Number = "number",
    DateTime = "datetime",

    //Selection
    CheckBox = "checkbox",
    TagList = "taglist",
    Select = "select",
    CheckList = "checklist",
    Radio = "radio",

    //Presentation
    Group = "group",
    Spacer = "spacer",
    TextView = "text",
    Image = "image",

    //Action
    Button = "button",
}


export enum DateTimeSubType {
    Time = "time",
    Date = "date",
    DateTime = "datetime"
}

export enum TimeFormat {
    NoTimezone = "no_timezone",
    UtcOffset = "utc_offset",
    UtcNormalized = "utc_normalized"
}

interface LayoutModel {
    row: string
    columns?: number | null | "auto"
}

interface AppearanceModel {
    prefixAdorner?: string;
    suffixAdorner?: string;
}

interface BaseValidation {
    required?: boolean;
}

export interface TextFieldValidation extends BaseValidation {
    validationType?: "email" | "phone";
    pattern?: string;
    minLength?: number;
    maxLength?: number;
}

export interface TextAreaValidation extends BaseValidation {
    minLength?: number;
    maxLength?: number;
}

export interface NumberValidation extends BaseValidation {
    min?: number;
    max?: number;
}

export interface BaseComponentModel {
    id: string;
    layout: LayoutModel;
    type: ComponentType;
    label: string;
}

export interface TextFieldModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    defaultValue?: string | null;
    disabled?: boolean;
    readonly?: boolean;
    appearance?: AppearanceModel;
    validate?: TextFieldValidation;
}

export interface TextAreaModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    defaultValue?: string | null;
    disabled?: boolean;
    readonly?: boolean;
    validate?: TextAreaValidation;
}

export interface NumberModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    defaultValue?: string | null;
    disabled?: boolean;
    readonly?: boolean;
    appearance?: AppearanceModel;
    decimalDigits?: number;
    increment?: string;
    serializeToString?: boolean;
    validate?: NumberValidation;
}

export interface DateTimeModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    dateLabel?: string;
    timeLabel?: string;
    disabled?: boolean;
    readonly?: boolean;
    subtype: DateTimeSubType;
    disallowPassedDates?: boolean;
    use24h?: boolean; //for time, datetime
    timeSerializingFormat?: TimeFormat;
    timeInterval?: number;
    validate?: BaseValidation;
}

export interface CheckBoxModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    defaultValue?: boolean;
    validate?: BaseValidation;
    disabled?: boolean;
    readonly?: boolean;
}

export interface CheckListModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    values?: Option[];
    valuesKey?: string;
    valuesExpression?: string;
    validate?: BaseValidation;
    disabled?: boolean;
    readonly?: boolean;
}

export interface TagListModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    values?: Option[];
    valuesKey?: string;
    valuesExpression?: string;
    validate?: BaseValidation;
    disabled?: boolean;
    readonly?: boolean;
}

export interface SelectModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    defaultValue?: string;
    searchable?: boolean;
    values?: Option[];
    valuesKey?: string;
    valuesExpression?: string;
    validate?: BaseValidation;
    disabled?: boolean;
    readonly?: boolean;
}

export interface RadioModel extends BaseComponentModel {
    key: string;
    description?: string | null;
    defaultValue?: string;
    values?: Option[];
    valuesKey?: string;
    valuesExpression?: string;
    validate?: BaseValidation;
    disabled?: boolean;
    readonly?: boolean;
}

export interface GroupModel extends BaseComponentModel {
    key: string;
    showOutline?: boolean;
    path?: string;
    components?: BaseComponentModel[];
}

export interface ImageModel extends BaseComponentModel {
    source?: string;
    alt?: string;
}

export interface TextModel extends BaseComponentModel {
    text?: string;
}

export interface SpacerModel extends BaseComponentModel {
    height?: number;
}


export interface ButtonModel extends BaseComponentModel {
    action: ActionType;
}

export enum ActionType {
    Submit = "submit",
    Reset = "reset"
}

export interface Option {
    label: string;
    value: string;
}