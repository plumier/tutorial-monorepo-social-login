import { MongooseFacility } from "@plumier/mongoose"
import dotenv from "dotenv"
import Koa from "koa"
import { join } from "path"
import Plumier, { Configuration, WebApiFacility } from "plumier"

import { schemaGenerator } from "./model/helper"
import { JwtAuthFacility } from "@plumier/jwt"
import { ServeStaticFacility } from "@plumier/serve-static"
import mongoose from "mongoose"


dotenv.config({ path: join(__dirname, "../../../", ".env") })
import { HerokuForceHttpsFacility } from "./heroku-facility"

export function createApp(config?: Partial<Configuration> & { mongoDbUri?: string }): Promise<Koa> {
    mongoose.set("useFindAndModify", false)
    return new Plumier()
        .set(config || {})
        .set(new HerokuForceHttpsFacility())
        .set(new WebApiFacility({ bodyParser: { multipart: true }, controller: join(__dirname, "controller") }))
        .set(new ServeStaticFacility({ root: join(__dirname, "../../ui/build") }))
        .set(new MongooseFacility({ uri: config && config.mongoDbUri || process.env.MONGODB_URI, schemaGenerator }))
        .set(new JwtAuthFacility({ secret: process.env.JWT_SECRET }))
        .initialize()
}
