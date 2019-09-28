import * as shell from "shelljs"
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import * as del from "del"

if(!shell.which("npx")){
    console.log("npx not installed, process exited")
    process.exit(1)
}

if(!existsSync(join(__dirname, "../packages/ui"))){
    //create UI project by execute create-react-app
    shell.exec("cd packages && npx create-react-app ui --typescript")
    //modify project name into @project/ui
    const packageJsonPath = join(__dirname, "../packages/ui/package.json")
    const json = readFileSync(packageJsonPath).toString()
    const packageObj = JSON.parse(json)
    packageObj.name = "@project/ui"
    packageObj.proxy = "http://localhost:8000"
    writeFileSync(packageJsonPath, JSON.stringify(packageObj, null, 4))
    del.sync(join(__dirname, "../packages/ui/.git"))
}