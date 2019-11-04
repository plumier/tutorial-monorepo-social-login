import bcrypt from "bcrypt"
import { authorize, bind, route, val } from "plumier"

import { LoginUser, User, UserModel } from "../../../model/model"

//custom validator to check if confirmedPassword is the same with password
function verifyTheSame() {
    return val.custom(async (x, { ctx }) => {
        if (x !== ctx.request.body.password)
            return "Password doesn't match"
    })
}

export class UsersController {

    //POST /api/v1/users
    @authorize.public()
    @route.post("")
    
    async save(data: User, @verifyTheSame() confirmPassword: string) {
        data.password = await bcrypt.hash(data.password, 10)
        return UserModel.create(<User>{ ...data, role: "User" })
    }

    //GET /api/v1/users/me
    me(@bind.user() user: LoginUser) {
        return UserModel.findById(user.userId)
    }
}
