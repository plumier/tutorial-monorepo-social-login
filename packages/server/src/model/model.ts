import { domain, val } from "@plumier/core"
import { collection, model } from "@plumier/mongoose"

@domain()
export class DomainBase {
    constructor(
        @val.optional()
        public createdAt: Date = new Date(),
        @val.optional()
        public updatedAt: Date = new Date(),
        @val.optional()
        public deleted: boolean = false
    ) { }
}

@collection()
export class Todo extends DomainBase {
    constructor(
        @val.length({ max: 64 })
        public title: string,
        @val.optional()
        public completed?: boolean
    ) { super() }
}

export const TodoModel = model(Todo)
