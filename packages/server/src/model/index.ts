import { authorize, domain, val } from "@plumier/core"
import { collection, model } from "@plumier/mongoose"
import { checkConfirmPassword } from "../validator"


export type UserRole = "Admin" | "User"

export interface LoginUser {
    userId: string,
    role: UserRole
}

@domain()
export class DomainBase {
    constructor(
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
        public deleted: boolean = false
    ) { }
}

@collection()
export class Todo extends DomainBase {
    constructor(
        @val.required()
        @val.length({ max: 64 })
        public title: string,
        public completed?: boolean
    ) { super() }
}

export const TodoModel = model(Todo)

@collection()
@checkConfirmPassword()
export class User extends DomainBase {
    constructor(
        @val.required()
        public name: string,
        @val.required()
        @val.email()
        @val.unique()
        public email: string,
        public picture: string,
        public password: string,
        @authorize.role("Admin")
        public role: UserRole,
        @authorize.role("Admin")
        public socialId: string,
        @authorize.role("Admin")
        public provider: "Facebook" | "Google" | "GitHub" | "Local"
    ) { super() }
}

export const userProjection = { password: 0 }

export const UserModel = model(User)
