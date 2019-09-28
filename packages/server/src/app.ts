import Koa from "koa";
import Plumier, { Configuration, WebApiFacility } from "plumier";
import { MongooseFacility } from "@plumier/mongoose";
import { schemaGenerator } from "./model/helper"

export function createApp(config?: Partial<Configuration>): Promise<Koa> {
    return new Plumier()
        .set(config || {})
        .set(new MongooseFacility({ uri: process.env.MONGODB_URI, schemaGenerator }))
        .set(new WebApiFacility())
        .initialize()
}
