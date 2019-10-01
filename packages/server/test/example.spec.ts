import { createApp } from "../src/app";
import supertest from "supertest"

describe("Example resource", () => {
    it("Should return 200", async () => {
        const koa = await createApp({ mode: "production" })
        await supertest(koa.callback())
            .get("/api/v1/examples")
            .expect(200, { message: "Hello world!" })
    })
})