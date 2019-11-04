import "./helper/supertest"

import supertest = require("supertest")

import stub from "./helper/stub"
import { AppStub, appStub } from "./helper/stub.app"
import { HttpMethod } from "plumier"

const userUrl = `/api/v1/users/me`

async function userByIdUrl() {
    const user = await stub.user.db()
    return { url: userUrl, id: user.id, owner: {id:user.id, role: user.role} }
}

describe("Users", () => {
    let app: AppStub
    beforeEach(async () => app = await appStub())
    afterEach(async () => await app.stop())

    describe("Functionalities", () => {

        describe("GET /api/v1/users/me", () => {
            it("Should return data", async () => {
                const { url, owner, id } = await userByIdUrl()
                const { body } = await supertest(app)
                    .get(url)
                    .by(owner)
                    .expect(200)
                const saved = await stub.user.get(id)
                expect(saved!.name).toBe(body.name)
                expect(saved!.id).toBe(body.id)
            })
        })
    })

    
    describe("Authorization", () => {
        describe("GET /api/v1/users/me", () => {
            it("Should accessible by Admin", async () => {
                const { url } = await userByIdUrl()
                await supertest(app)
                    .get(url)
                    .byAdmin()
                    .expect(200)
            })

            it("Should accessible by Owner", async () => {
                const { url, id } = await userByIdUrl()
                await supertest(app)
                    .get(url)
                    .by({ id, role: "User" })
                    .expect(200)
            })

            it("Should not accessible by public", async () => {
                const { url } = await userByIdUrl()
                await supertest(app)
                    .get(url)
                    .expect(403)
            })
        })
    })
})