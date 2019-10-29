interface DomainBase {
    id: string
    createdAt: Date
    updatedAt: Date
    deleted: boolean
}

interface Todo extends DomainBase {
    title: string,
    completed?: boolean
}

interface User extends DomainBase {
    name: string,
    email: string,
    picture: string,
    password: string,
    role: string
}