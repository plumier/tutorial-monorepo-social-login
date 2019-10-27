import "./helper/supertest"

import supertest = require("supertest")

import stub from "./helper/stub"
import { AppStub, appStub } from "./helper/stub.app"

async function userByIdUrl() {
    const user = await stub.user.db()
    return { url: `/api/v1/users/me`, id: user.id, owner: {id:user.id, role: user.role} }
}

describe("Users", () => {
    let app: AppStub
    beforeEach(async () => app = await appStub())
    afterEach(async () => await app.stop())

    describe("Functionalities", () => {

        describe("PUT /api/v1/users/me", () => {
            it("Should modify properly", async () => {
                const { url, owner } = await userByIdUrl()
                const { body } = await supertest(app)
                    .put(url)
                    .send({ name: "John" })
                    .by(owner)
                    .expect(200)
                const saved = await stub.user.get(body.id)
                expect(saved!.toObject()).toMatchObject({ name: "John" })
            })

            it("Should not able to set role", async () => {
                const { url, owner } = await userByIdUrl()
                await supertest(app)
                    .put(url)
                    .send({ role: "Admin" })
                    .by(owner)
                    .expect(401)
            })
        })

        describe("PATCH /api/v1/users/me", () => {
            it("Should modify properly", async () => {
                const { url, owner } = await userByIdUrl()
                const { body } = await supertest(app)
                    .patch(url)
                    .send({ name: "John" })
                    .by(owner)
                    .expect(200)
                const saved = await stub.user.get(body.id)
                expect(saved!.toObject()).toMatchObject({ name: "John" })
            })
            it("Should not able to set role", async () => {
                const { url, owner } = await userByIdUrl()
                await supertest(app)
                    .patch(url)
                    .send({ role: "Admin" })
                    .by(owner)
                    .expect(401)
            })
        })

        describe("DELETE /api/v1/users/me", () => {
            it("Should delete properly", async () => {
                const { url, owner } = await userByIdUrl()
                const { body } = await supertest(app)
                    .delete(url)
                    .by(owner)
                    .expect(200)
                const saved = await stub.user.get(body.id)
                expect(saved!.toObject()).toMatchObject({ deleted: true })
            })
        })

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
})