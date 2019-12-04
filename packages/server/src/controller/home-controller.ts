import "@plumier/serve-static"

import { join } from "path"
import { authorize, response, route } from "plumier"

export class HomeController {

    @authorize.public()
    @route.get("/")
    //historyApiFallback https://plumierjs.com/docs/refs/serve-static#history-api-fallback
    //to enable bookmark and in location refresh for SPA
    @route.historyApiFallback()
    index(){
        return response.file(join(__dirname, "../../../ui/build/index.html"))
    }
}