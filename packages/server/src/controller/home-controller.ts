import "@plumier/serve-static"

import { join } from "path"
import { authorize, response, route } from "plumier"

export class HomeController {

    //provide server side route to handle react route.
    //thus when user refresh browser in specific route, it will keep in the correct url
    @authorize.public()
    @route.get("/")
    @route.historyApiFallback()
    index(){
        return response.file(join(__dirname, "../../../ui/build/index.html"))
    }
}