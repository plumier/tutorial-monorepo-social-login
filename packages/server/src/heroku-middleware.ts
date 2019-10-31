import {Middleware, Invocation, ActionResult, response} from "plumier"


export class HerokuForceHttpsMiddleware implements Middleware {
    async execute(invocation: Readonly<Invocation>): Promise<ActionResult> {
        if(process.env.NODE_ENV === "production"){
            const req = invocation.context.request;
            
            if(req.headers["x-forwarded-proto"] !== "https"){
                return response.redirect(`https://${req.hostname}${req.originalUrl}`)
            }
            else {
                req.secure = true

            }
        }
        return invocation.proceed()
    }
}