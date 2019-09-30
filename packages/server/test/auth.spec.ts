import { MongoMemoryServer } from "mongodb-memory-server-global"
import { createApp } from "../src/app"


describe("Social Login", () => {
    let mongo: MongoMemoryServer;

    beforeEach(async () => {
        const mongo = new MongoMemoryServer()
        const uri = await mongo.getConnectionString()
        //createApp called to trigger mongoose model generator
        await createApp({ mongoDbUri: uri })
    })

    afterEach(async () => await mongo.stop())

    it("Registered user should able to login", () => {
        
    })
})