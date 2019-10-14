import { IncomingMessage, ServerResponse } from "http"
import { Http2ServerRequest, Http2ServerResponse } from "http2"
import { MongoMemoryServer } from "mongodb-memory-server-global"
import Mongoose from "mongoose"

import { createApp } from "../../src/app"


export interface AppStub {
    (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse): void
    stop: () => Promise<void>
}


export async function appStub(): Promise<AppStub> {
    const mongo = new MongoMemoryServer()
    const uri = await mongo.getConnectionString()
    const koa = await createApp({ mongoDbUri: uri, mode: "production" })
    const app:AppStub = koa.callback() as any
    app.stop = async () => {
        await Mongoose.disconnect()
        await mongo.stop()
    }
    return app
}
