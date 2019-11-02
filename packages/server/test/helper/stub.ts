import faker from "faker"
import { Document, Model } from "mongoose"

import { TodoModel, UserModel } from "../../src/model/model"
import { facebook } from "./stub.social"

class Stub<T>{
    constructor(protected model: Model<T & Document>, public random: () => Partial<T>) { }

    async db(opt?: Partial<T>) {
        return new this.model({ ...this.random(), ...opt }).save()
    }

    get(id: string | {}) {
        if (typeof id === "string")
            return this.model.findById(id)
        else
            return this.model.findOne(id)
    }
}

const user = new Stub(UserModel, () => ({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: "123456",
    confirmPassword: "123456",
    picture: faker.image.imageUrl(300, 300),
}))

const todo = new Stub(TodoModel, () => ({
    title: faker.lorem.slug(5)
}))


const stub = { user, facebook, todo }
export default stub;