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
                expect(body.message).toMatchObject([{ path: ["data", "confirmPassword"], messages: ["Password doesn't match"] }])
            })

        })

        describe("PUT /api/v1/users/:id", () => {
            it("Should modify properly", async () => {
                const { url, id } = await userByIdUrl()
                const { body } = await supertest(app)
                    .put(url)
                    .send({ name: "John" })
                    .by({ id, role: "User" })
                    .expect(200)
                const saved = await stub.user.get(body.id)
                expect(saved!.toObject()).toMatchObject({ name: "John" })
            })

            it("Should not able to set role", async () => {
                const { url, id } = await userByIdUrl()
                await supertest(app)
                    .put(url)
                    .send({ role: "Admin" })
                    .by({ id, role: "User" })
                    .expect(401)
            })
        })

        describe("PATCH /api/v1/users/:id", () => {
            it("Should modify properly", async () => {
                const { url, id } = await userByIdUrl()
                const { body } = await supertest(app)
                    .patch(url)
                    .send({ name: "John" })
                    .by({ id, role: "User" })
                    .expect(200)
                const saved = await stub.user.get(body.id)
                expect(saved!.toObject()).toMatchObject({ name: "John" })
            })
            it("Should not able to set role", async () => {
                const { url, id } = await userByIdUrl()
                await supertest(app)
                    .patch(url)
                    .send({ role: "Admin" })
                    .by({ id, role: "User" })
                    .expect(401)
            })
        })

        describe("DELETE /api/v1/users/:id", () => {
            it("Should delete properly", async () => {
                const { url, id } = await userByIdUrl()
                const { body } = await supertest(app)
                    .delete(url)
                    .by({ id, role: "User" })
                    .expect(200)
                const saved = await stub.user.get(body.id)
                expect(saved!.toObject()).toMatchObject({ deleted: true })
            })
        })

        describe("GET /api/v1/users/:id", () => {
            it("Should return data", async () => {
                const { url, id } = await userByIdUrl()
                const { body } = await supertest(app)
                    .get(url)
                    .by({ id, role: "User" })
                    .expect(200)
                const saved = await stub.user.get(id)
                expect(saved!.name).toBe(body.name)
                expect(saved!.id).toBe(body.id)
            })
        })

        describe("GET /api/v1/users?offset&limit", () => {
            it("Should list properly", async () => {
                await Promise.all(Array(20).fill(1).map(x => stub.user.db()))
                const { body } = await supertest(app)
                    .get(`${userUrl}?offset=0&limit=10`)
                    .byAnyUser()
                    .expect(200)
                expect(body.length).toBe(10)
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

        for (const method of ["put", "patch"] as HttpMethod[]) {
            describe(`${method.toUpperCase()} /api/v1/users/:id`, () => {
                it("Should accessible by Admin", async () => {
                    const { url } = await userByIdUrl()
                    await supertest(app)
                    [method](url)
                        .send(stub.user.random())
                        .byAdmin()
                        .expect(200)
                })

                it("Should accessible by Owner", async () => {
                    const { url, id } = await userByIdUrl()
                    await supertest(app)
                    [method](url)
                        .send(stub.user.random())
                        .by({ id, role: "User" })
                        .expect(200)
                })

                it("Should not accessible by any login user", async () => {
                    const { url } = await userByIdUrl()
                    await supertest(app)
                    [method](url)
                        .send(stub.user.random())
                        .byAnyUser()
                        .expect(401)
                })

                it("Should not accessible by public", async () => {
                    const { url } = await userByIdUrl()
                    await supertest(app)
                    [method](url)
                        .send(stub.user.random())
                        .expect(403)
                })

                it("Role should modified by Admin", async () => {
                    const { url } = await userByIdUrl()
                    await supertest(app)
                    [method](url)
                        .send({ role: "Admin" })
                        .byAdmin()
                        .expect(200)
                })

                it("Role should not modified by Owner", async () => {
                    const { url, id } = await userByIdUrl()
                    await supertest(app)
                    [method](url)
                        .send({ role: "Admin" })
                        .by({ id, role: "User" })
                        .expect(401)
                })
            })
        }

        describe("DELETE /api/v1/users/:id", () => {
            it("Should accessible by Admin", async () => {
                const { url } = await userByIdUrl()
                await supertest(app)
                    .delete(url)
                    .byAdmin()
                    .expect(200)
            })

            it("Should accessible by Owner", async () => {
                const { url, id } = await userByIdUrl()
                await supertest(app)
                    .delete(url)
                    .by({ id, role: "User" })
                    .expect(200)
            })

            it("Should not accessible by any user", async () => {
                const { url } = await userByIdUrl()
                await supertest(app)
                    .delete(url)
                    .byAnyUser()
                    .expect(401)
            })

            it("Should not accessible by public", async () => {
                const { url } = await userByIdUrl()
                await supertest(app)
                    .delete(url)
                    .expect(403)
            })
        })

        describe("GET /api/v1/users/:id", () => {
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

            it("Should not accessible by any user", async () => {
                const { url } = await userByIdUrl()
                await supertest(app)
                    .get(url)
                    .byAnyUser()
                    .expect(401)
            })

            it("Should not accessible by public", async () => {
                const { url } = await userByIdUrl()
                await supertest(app)
                    .get(url)
                    .expect(403)
            })
        })

        describe("GET /api/v1/users?offset&limit", () => {
            it("Should accessible by any login user", async () => {
                await Promise.all(Array(20).fill(1).map(x => stub.user.db()))
                await supertest(app)
                    .get(`${userUrl}?offset=0&limit=10`)
                    .byAnyUser()
                    .expect(200)
            })

            it("Should not accessible by public", async () => {
                await Promise.all(Array(20).fill(1).map(x => stub.user.db()))
                await supertest(app)
                    .get(`${userUrl}?offset=0&limit=10`)
                    .expect(403)
            })
        })
    })
})