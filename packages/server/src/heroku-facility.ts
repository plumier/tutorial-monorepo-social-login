import { DefaultFacility, Invocation, ActionResult, response, PlumierApplication } from "plumier"


export class HerokuForceHttpsFacility extends DefaultFacility {
    setup(app: Readonly<PlumierApplication>): void {
        app.koa.proxy = true
        app.use({
            execute: async invocation => {
                if (process.env.NODE_ENV === "production") {
                    const req = invocation.context.request;
                    if (req.headers["x-forwarded-proto"] !== "https") {
                        return response.redirect(`https://${req.hostname}${req.originalUrl}`)
                    }
                }
                return invocation.proceed()
            }
        })
    }
}