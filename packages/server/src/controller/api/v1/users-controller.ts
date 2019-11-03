import bcrypt from "bcrypt"
import { authorize, route, val, middleware, bind } from "plumier"

import { User, UserModel } from "../../../model/model"

// --------------------------------------------------------------------- //
// ----------------------------- DECORATORS ---------------------------- //
// --------------------------------------------------------------------- //

//decorator (custom authorization) to restrict access to only the owner of the data
function authorizeOwner() {
    return authorize.custom(async ctx => {
        //if the path ends with is /users/me check only the login ticket
        if (ctx.ctx.path.endsWith("/users/me")) return !!ctx.user
        //if the path is /users/:id check if "id" is the same as the login user id
        return ctx.parameters[0] === ctx.user.userId
    }, "Owner")
}

//decorator (custom validator) for registration
function validate() {
    return val.custom(async x => {
        const result = []
        if (x.confirmPassword === "" || x.confirmPassword === undefined || x.confirmPassword === null)
            result.push({ path: "confirmPassword", messages: ["Required"] })
        if (x.password !== x.confirmPassword)
            result.push({ path: "confirmPassword", messages: ["Password doesn't match"] })
        if (result.length > 0) return result
    })
}

export class UsersController {
    @route.get("")
    all(@val.optional() offset: number, @val.optional() limit: number) {
        return UserModel.find({ deleted: false })
            .limit(limit)
            .skip(offset)
    }

    @authorize.public()
    @route.post("")
    async save(@validate() data: User) {
        data.password = await bcrypt.hash(data.password, 10)
        return UserModel.create(<User>{ ...data, role: "User" })
    }
}

//reuse controller to handle 2 endpoints 
//in case of /users/me use class specific middleware to assigned the id parameter see below
@route.root("users/me")
@route.root("users/:id")
//class specific middleware. applied to all UserByIdController methods
@middleware.use({
    execute: async i => {
        //if the path is /users/me
        //bind first parameters (id) with current login user
        if (i.context.path.endsWith("/users/me"))
            i.context.parameters![0] = i.context.state.user.userId
        return i.proceed()
    }
})
export class UserByIdController {

    @authorize.role("Admin")
    @authorizeOwner()
    @route.get("")
    get(@val.optional() @val.mongoId() id: string) {
        return UserModel.findById(id)
    }

    @authorize.role("Admin")
    @authorizeOwner()
    @route.put("")
    @route.patch("")
    async update(@val.optional() @val.mongoId() id: string, @val.partial(User) data: Partial<User>) {
        if (data.password)
            data.password = await bcrypt.hash(data.password, 10)
        return UserModel.findByIdAndUpdate(id, data)
    }

    @authorize.role("Admin")
    @authorizeOwner()
    @route.delete("")
    delete(@val.optional() @val.mongoId() id: string) {
        return UserModel.findByIdAndUpdate(id, { deleted: true })
    }
}