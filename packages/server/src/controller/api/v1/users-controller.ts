import bcrypt from "bcrypt"
import { authorize, route, val } from "plumier"

import { User, UserModel } from "../../../model/model"

function authorizeOwner() {
    return authorize.custom(async ctx => ctx.parameters[0] === ctx.user.userId, "Owner")
}

export class UsersController {
    @route.get("")
    all(@val.optional() offset: number, @val.optional() limit: number) {
        return UserModel.find({ deleted: false })
            .limit(limit)
            .skip(offset)
    }

    @authorize.role("Admin")
    @authorizeOwner()
    @route.get(":id")
    get(@val.mongoId() id: string) {
        return UserModel.findById(id)
    }

    @authorize.public()
    @route.post("")
    async save(data: User) {
        data.password = await bcrypt.hash(data.password, 10)
        return UserModel.create(<User>{ ...data, role: "User" })
    }

    @authorize.role("Admin")
    @authorizeOwner()
    @route.put(":id")
    @route.patch(":id")
    async update(@val.mongoId() id: string, @val.partial(User) data: Partial<User>) {
        if (data.password)
            data.password = await bcrypt.hash(data.password, 10)
        return UserModel.findByIdAndUpdate(id, data)
    }

    @authorize.role("Admin")
    @authorizeOwner()
    @route.delete(":id")
    delete(@val.mongoId() id: string) {
        return UserModel.findByIdAndUpdate(id, { deleted: true })
    }
}