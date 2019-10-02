import faker from "faker"
import { Model, Document } from "mongoose"
import { User, UserModel, SocialLoginModel } from "../../src/model/model"
import { FacebookProfile, FacebookProvider, FacebookLoginStatus } from "@plumier/social-login"

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

function facebook(opt?:Partial<FacebookProfile>){
    const profile = (opt?:Partial<FacebookProfile>) => <FacebookProfile>({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        picture: {
            data: {
                url: faker.image.imageUrl()
            }
        }, 
        ...opt
    })
    return new FacebookLoginStatus("Success", undefined, profile(opt))
}

const stub = { user, socialLogin, facebook }
export default stub;