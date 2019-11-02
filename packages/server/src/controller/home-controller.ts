import "@plumier/serve-static"
import {route, response, authorize} from "plumier"
import { join } from "path"

export class HomeController {

    //provide server side route to handle react route.
    //thus when user refresh browser in specific route, it will keep in the correct url
    @authorize.public()
    @route.get("/")
    @route.get("/login")
    @route.get("/register")
    index(){
        return response.file(join(__dirname, "../../../ui/build/index.html"))
    }
}