import { JwtAuthFacility } from "@plumier/jwt"
import { MongooseFacility, SchemaGenerator } from "@plumier/mongoose"
import { ServeStaticFacility } from "@plumier/serve-static"
import dotenv from "dotenv"
import Koa from "koa"
import mongoose from "mongoose"
import { join } from "path"
import Plumier, { Configuration, DefaultFacility, PlumierApplication, response, WebApiFacility } from "plumier"
import { OAuthFacility, FacebookOAuthFacility, GitHubOAuthFacility, GoogleOAuthFacility } from "@plumier/social-login"


const schemaGenerator: SchemaGenerator = def => {
    if (def.deleted)
        def.deleted = { type: Boolean, default: false }
    const schema = new mongoose.Schema(def, { timestamps: true })
    schema.set("toJSON", { virtuals: true, versionKey: false })
    schema.set("toObject", { virtuals: true, versionKey: false })
    return schema
}

class HerokuForceHttpsFacility extends DefaultFacility {
    setup(app: Readonly<PlumierApplication>): void {
        //heroku provide SSL behind proxy it will not touch the application
        //use Koa proxy to enable check the x-forwarded-proto header
        app.koa.proxy = true

        //heroku doesn't provide enforce HTTPS
        //add middleware logic to redirect all http request into https request
        app.use({
            execute: async invocation => {
                if (process.env.NODE_ENV === "production") {
                    const req = invocation.ctx.request;
                    if (req.headers["x-forwarded-proto"] !== "https") {
                        return response.redirect(`https://${req.hostname}${req.originalUrl}`)
                    }
                }
                return invocation.proceed()
            }
        })
    }
}

dotenv.config({ path: join(__dirname, "../../../", ".env") })

export function createApp(config?: Partial<Configuration> & { mongoDbUri?: string }): Promise<Koa> {
    mongoose.set("useFindAndModify", false)
    return new Plumier()
        .set(config || {})
        .set(new HerokuForceHttpsFacility())
        .set(new WebApiFacility({ bodyParser: { multipart: true }, controller: join(__dirname, "controller") }))
        .set(new ServeStaticFacility({ root: join(__dirname, "../../ui/build") }))
        .set(new MongooseFacility({ model: join(__dirname, "model"), uri: config && config.mongoDbUri || process.env.MONGODB_URI, schemaGenerator }))
        .set(new JwtAuthFacility({ secret: process.env.JWT_SECRET }))
        .set(new OAuthFacility())
        .set(new FacebookOAuthFacility({ clientId: process.env.FACEBOOK_CLIENT_ID, clientSecret: process.env.FACEBOOK_SECRET }))
        .set(new GitHubOAuthFacility({ clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_SECRET }))
        .set(new GoogleOAuthFacility({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_SECRET }))
        .initialize()
}
