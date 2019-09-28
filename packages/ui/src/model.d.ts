interface DomainBase {
    id:string
    createdAt: Date
    updatedAt: Date
    deleted: boolean
}

interface Todo extends DomainBase {
    title: string,
    completed?: boolean
}