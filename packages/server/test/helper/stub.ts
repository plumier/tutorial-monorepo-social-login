import faker from "faker"
import { Document, Model } from "mongoose"

import { SocialLoginModel, TodoModel, UserModel } from "../../src/model/model"
import {facebook} from "./stub.social"

class Stub<T>{
    constructor(protected model: Model<T & Document>, public random: () => Partial<T>) { }

    async db(opt?: Partial<T>) {
        return new this.model({...this.random(), ...opt }).save()
    }

    get(id: string | {}) {
        if(typeof id === "string")
            return this.model.findById(id)
        else 
            return this.model.findOne(id)
    }
}

const user = new Stub(UserModel, () => ({
    name: faker.name.findName(),
    picture: faker.image.imageUrl(300, 300),
    role: "User" as "User"
}))

const socialLogin = new Stub(SocialLoginModel, () => ({
    socialId: faker.random.uuid(),
    provider: "Facebook" as "Facebook"
}))

const todo = new Stub(TodoModel, () => ({
    title: faker.lorem.slug(5)
}))


const stub = { user, socialLogin, facebook, todo }
export default stub;