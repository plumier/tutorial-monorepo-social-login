import { FacebookLoginStatus, FacebookProfile } from "@plumier/social-login"
import faker from "faker"

export function facebook(opt?: Partial<FacebookProfile>) {
    const profile = (opt?: Partial<FacebookProfile>) => <FacebookProfile>({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        picture: {
            data: {
                url: faker.image.imageUrl()
            }
        },
        ...opt
    })
    return <FacebookLoginStatus>{ status: "Success", data: profile(opt) }
}