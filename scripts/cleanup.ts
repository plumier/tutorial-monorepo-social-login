import * as del from "del"

del.sync([
    "packages/server/public",
    "packages/server/src/**/*.js",
    "packages/server/test/**/*.js",
    "packages/ui/build"
])