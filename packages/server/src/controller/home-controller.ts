import "@plumier/serve-static"
import {route, response, authorize} from "plumier"
import { join } from "path"

export class HomeController {
    @authorize.public()
    @route.get("/")
    @route.get("/login")
    index(){
        return response.file(join(__dirname, "../../public/index.html"))
    }
}