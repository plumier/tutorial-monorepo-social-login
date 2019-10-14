import { AppStub, appStub } from "./helper/stub.app"
import stub from "./helper/stub"
import supertest = require("supertest")
import "./helper/supertest"

const todoUrl = "/api/v1/todos"

async function todoByIdUrl() {
    const todo = await stub.todo.db({ completed: false })
    return { url: `${todoUrl}/${todo.id}`, id: todo.id }
}

describe("Todo", () => {
    let app: AppStub
    beforeEach(async () => app = await appStub())
    afterEach(async () => await app.stop())

    describe("Functionalities", () => {
        describe("POST /api/v1/todos", () => {
            it("Should add properly", async () => {
                const data = stub.todo.random()
                await supertest(app)
                    .post(todoUrl)
                    .send(data)
                    .byAnyUser()
                    .expect(200)
            })

            it("Should add todo as incomplete by default", async () => {
                const data = stub.todo.random()
                const { body } = await supertest(app)
                    .post(todoUrl)
                    .send(data)
                    .byAnyUser()
                    .expect(200)
                const saved = await stub.todo.get(body.id)
                expect(saved!.toObject()).toMatchObject({ ...data, completed: false, deleted: false })
            })
        })

        describe("PUT /api/v1/todos/:id", () => {
            it("Should modify properly", async () => {
                const { url } = await todoByIdUrl()
                const data = stub.todo.random()
                const { body } = await supertest(app)
                    .put(url)
                    .send(data)
                    .byAnyUser()
                    .expect(200)
                const saved = await stub.todo.get(body.id)
                expect(saved!.toObject()).toMatchObject({ ...data, completed: false, deleted: false })
            })

            it("Should able to set completion", async () => {
                const { url } = await todoByIdUrl()
                const { body } = await supertest(app)
                    .put(url)
                    .send({ completed: true })
                    .byAnyUser()
                    .expect(200)
                const saved = await stub.todo.get(body.id)
                expect(saved!.toObject()).toMatchObject({ completed: true })
            })
        })

        describe("PATCH /api/v1/todos/:id", () => {
            it("Should modify properly", async () => {
                const { url } = await todoByIdUrl()
                const data = stub.todo.random()
                const { body } = await supertest(app)
                    .patch(url)
                    .send(data)
                    .byAnyUser()
                    .expect(200)
                const saved = await stub.todo.get(body.id)
                expect(saved!.toObject()).toMatchObject({ ...data, completed: false, deleted: false })
            })
            it("Should able to set completion", async () => {
                const { url } = await todoByIdUrl()
                const { body } = await supertest(app)
                    .patch(url)
                    .send({ completed: true })
                    .byAnyUser()
                    .expect(200)
                const saved = await stub.todo.get(body.id)
                expect(saved!.toObject()).toMatchObject({ completed: true })
            })
        })

        describe("DELETE /api/v1/todos/:id", () => {
            it("Should delete properly", async () => {
                const { url } = await todoByIdUrl()
                const { body } = await supertest(app)
                    .delete(url)
                    .byAnyUser()
                    .expect(200)
                const saved = await stub.todo.get(body.id)
                expect(saved!.toObject()).toMatchObject({ deleted: true })
            })
        })

        describe("GET /api/v1/todos?offset&limit", () => {
            it("Should list properly", async () => {
                await Promise.all(Array(20).fill(1).map(x => stub.todo.db()))
                const { body } = await supertest(app)
                    .get(`${todoUrl}?offset=0&limit=10`)
                    .byAnyUser()
                    .expect(200)
                expect(body.length).toBe(10)
            })
        })
    })
})