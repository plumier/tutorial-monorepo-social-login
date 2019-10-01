import { createApp } from "./app";
import dotenv from "dotenv"
import { join } from "path";

dotenv.config({ path: join(__dirname, "../../../", ".env") })
const port = process.env.PORT || 8000;
createApp()
    .then(x => x.listen(port))
    .then(x => console.log(`Server running http://localhost:${port}/`))
    .catch(e => console.error(e))