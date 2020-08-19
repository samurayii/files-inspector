export interface IInspectorConfig {
    folders: string[]
    regexp: string[]
}

export interface IInspectorResult {
    count: number
    files: string[] 
}

export interface IInspector {
    inspect: () => IInspectorResult
}