import { createApp } from "./app";
import { join } from "path";

const port = process.env.PORT || 8000;
createApp()
    .then(x => x.listen(port))
    .then(x => console.log(`Server running http://localhost:${port}/`))
    .catch(e => console.error(e))