import { MongooseFacility } from "@plumier/mongoose"
import dotenv from "dotenv"
import Koa from "koa"
import { join } from "path"
import Plumier, { Configuration, WebApiFacility } from "plumier"

import { schemaGenerator } from "./model/helper"

dotenv.config({ path: join(__dirname, "../../../", ".env") })

export function createApp(config?: Partial<Configuration> & { mongoDbUri?: string }): Promise<Koa> {
    return new Plumier()
        .set(config || {})
        .set(new MongooseFacility({ uri: config && config.mongoDbUri || process.env.MONGODB_URI, schemaGenerator }))
        .set(new WebApiFacility())
        .initialize()
}
