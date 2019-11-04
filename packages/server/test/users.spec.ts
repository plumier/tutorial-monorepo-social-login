import { AppStub, appStub } from "./helper/stub.app"
import stub from "./helper/stub"
import supertest = require("supertest")
import "./helper/supertest"
import { HttpMethod } from "plumier"

const userUrl = "/api/v1/users"

async function userByIdUrl() {
    const user = await stub.user.db()
    return { url: `${userUrl}/${user.id}`, id: user.id }
}

describe("Users", () => {
    let app: AppStub
    beforeEach(async () => app = await appStub())
    afterEach(async () => await app.stop())

    describe("Functionalities", () => {
        describe("POST /api/v1/users", () => {
            it("Should add properly", async () => {
                const data = stub.user.random()
                await supertest(app)
                    .post(userUrl)
                    .send(data)
                    .expect(200)
            })

            it("Should assigned as User by default", async () => {
                const data = stub.user.random()
                const { body } = await supertest(app)
                    .post(userUrl)
                    .send(data)
                    .expect(200)
                const saved = await stub.user.get(body.id)
                expect(saved!.role).toBe("User")
            })

            it("Should validate un match password", async () => {
                const data = stub.user.random()
                const { body } = await supertest(app)
                    .post(userUrl)
                    .send({ ...data, confirmPassword: "4545" })
                    .expect(422)
                expect(body.message).toMatchObject([{ path: ["confirmPassword"], messages: ["Password doesn't match"] }])
            })

        })

    })

    describe("Authorization", () => {
        describe("POST /api/v1/users", () => {
            it("Should accessible by login user", async () => {
                const data = stub.user.random()
                await supertest(app)
                    .post(userUrl)
                    .send(data)
                    .byAnyUser()
                    .expect(200)
            })

            it("Should accessible by public", async () => {
                const data = stub.user.random()
                await supertest(app)
                    .post(userUrl)
                    .send(data)
                    .expect(200)
            })


            it("Role should not modified by public", async () => {
                const data = stub.user.random()
                await supertest(app)
                    .post(userUrl)
                    .send({ ...data, role: "Admin" })
                    .expect(401)
            })

            it("Role should not modified by User", async () => {
                const data = stub.user.random()
                await supertest(app)
                    .post(userUrl)
                    .byAnyUser()
                    .send({ ...data, role: "Admin" })
                    .expect(401)
            })

            it("Role should modified by admin", async () => {
                const data = stub.user.random()
                await supertest(app)
                    .post(userUrl)
                    .byAdmin()
                    .send({ ...data, role: "Admin" })
                    .expect(200)
            })
        })
    })
})