import bcrypt from "bcrypt"
import { authorize, route, val, middleware } from "plumier"

import { User, UserModel } from "../../../model/model"

function authorizeOwner() {
    return authorize.custom(async ctx => {
        if (ctx.ctx.path.search(/users\/me$/i) > -1) return !!ctx.user
        return ctx.parameters[0] === ctx.user.userId
    }, "Owner")
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
    async save(data: User) {
        data.password = await bcrypt.hash(data.password, 10)
        return UserModel.create(<User>{ ...data, role: "User" })
    }

}

@route.root("/users/me")
@route.root("/users/:id")
@middleware.use({
    execute: async i => {
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