/**
 * Representation of user task or start forms used in the Flowset Tasklist pages.
 */
export interface ProcessFormData {
    formKey?: string;
    version?: number;
    content?: string;
    type: FormType;
}

/**
 * Type of user task and start forms used in the processes
 */
export enum FormType {
    HTML = "HTML",
    FORM_JS_JSON = "FORM_JS_JSON",
    EMBEDDED = "EMBEDDED",
    CUSTOM = "CUSTOM"
}

export interface InitialData {
    [key: string]: unknown;
}