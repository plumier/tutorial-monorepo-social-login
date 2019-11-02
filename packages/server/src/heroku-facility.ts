import { DefaultFacility, Invocation, ActionResult, response, PlumierApplication } from "plumier"

export class HerokuForceHttpsFacility extends DefaultFacility {
    setup(app: Readonly<PlumierApplication>): void {
        //heroku provide SSL behind proxy it will not touch the application
        //use Koa proxy to enable check the x-forwarded-proto header
        app.koa.proxy = true

        //heroku doesn't provide enforce HTTPS
        //add middleware logic to redirect all http request into https request
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