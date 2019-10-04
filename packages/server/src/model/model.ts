import { domain, val } from "@plumier/core"
import { collection, model } from "@plumier/mongoose"
import reflect from "tinspector"


export type UserRole = "Admin" | "User"

export interface LoginUser {
    userId: string,
    role: UserRole
}

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

@collection()
export class SocialLogin extends DomainBase {
    constructor(
        public socialId: string,
        public provider: "Facebook" | "Google" | "Github"
    ) { super() }
}

export const SocialLoginModel = model(SocialLogin)

@collection()
export class User extends DomainBase {
    constructor(
        public name: string,
        @val.email()
        @val.unique()
        public email:string,
        @val.optional()
        public picture: string="",
        public userName: string,
        public password: string,
        public role: UserRole,
        @reflect.array(SocialLogin)
        public socialLogin: SocialLogin[]
    ) { super() }
}

export const UserModel = model(User)
