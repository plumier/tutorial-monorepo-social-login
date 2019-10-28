import { MongooseFacility } from "@plumier/mongoose"
import dotenv from "dotenv"
import Koa from "koa"
import { join } from "path"
import Plumier, { Configuration, WebApiFacility } from "plumier"

import { schemaGenerator } from "./model/helper"
import { JwtAuthFacility } from "@plumier/jwt"
import { ServeStaticFacility } from "@plumier/serve-static"


dotenv.config({ path: join(__dirname, "../../../", ".env") })

export function createApp(config?: Partial<Configuration> & { mongoDbUri?: string }): Promise<Koa> {
    return new Plumier()
        .set(config || {})
        .use({execute: async i => {
            console.log("REQUEST", i.context.path)
            return i.proceed()
        }})
        .set(new WebApiFacility({ controller: join(__dirname, "controller") }))
        .set(new ServeStaticFacility({root: join(__dirname, "../public")}))
        .set(new MongooseFacility({ uri: config && config.mongoDbUri || process.env.MONGODB_URI, schemaGenerator }))
        .set(new JwtAuthFacility({ secret: process.env.JWT_SECRET }))
        .initialize()
}
