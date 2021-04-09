export type Task = {
    uid: string | null,
    title: string,
    description: string,
    due_date: string | Date,
    duration: string | Number,
    tags: any[],
    contacts: any[],
    checklist: any[],
    tracks: any[],
    order: number,
    duration_ms: number,
    done: boolean,
    commit_date: string | null,
    matrix: 'todo'|'schedule'|'delegate'|'delete'|'backlog',
}

export type AppSelectorProps = {
    data: any,
    value: string,
    onChange: Function 
    isVisible: boolean,
    onClose: boolean | Function
} 