import * as del from "del"

del.sync([
    "packages/server/src/**/*.js",
    "packages/server/test/**/*.js",
    "packages/ui/build"
])