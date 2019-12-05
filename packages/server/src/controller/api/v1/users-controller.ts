import bcrypt from "bcrypt"
import { authorize, bind, route, val } from "plumier"

import { LoginUser, User, UserModel, userProjection } from "../../../model"

export class UsersController {

    //POST /api/v1/users
    @authorize.public()
    @route.post("")
    
    async save(data: User) {
        data.password = await bcrypt.hash(data.password, 10)
        return UserModel.create(<User>{ ...data, role: "User" })
    }

    //GET /api/v1/users/me
    me(@bind.user() user: LoginUser) {
        return UserModel.findById(user.userId, userProjection)
    }
}
