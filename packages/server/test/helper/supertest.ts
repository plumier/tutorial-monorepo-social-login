import { sign } from "jsonwebtoken"
import mongoose from "mongoose"
import superagent from "superagent"
import { Response, Test } from "supertest"

import { LoginUser, UserRole } from "../../src/model"



// --------------------------------------------------------------------- //
// ------------------------------- TYPES ------------------------------- //
// --------------------------------------------------------------------- //

declare module "superagent" {
    interface Request {
        by(user: { id: string, role: UserRole }): Test
        byAdmin(): Test
        byAnyUser(): Test
        columns(columns: string[]): Test
    }
}

// --------------------------------------------------------------------- //
// ------------------------------ HELPERS ------------------------------ //
// --------------------------------------------------------------------- //

const id = () => mongoose.Types.ObjectId().toHexString()

// --------------------------------------------------------------------- //
// -------------------------- IMPLEMENTATIONS -------------------------- //
// --------------------------------------------------------------------- //

const SuperAgentRequest = (superagent as any).Request as Function;

SuperAgentRequest.prototype.by = function (user: { id: string, role: UserRole }) {
    const token = sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.JWT_SECRET)
    return this.set("Authorization", `Bearer ${token}`)
}

SuperAgentRequest.prototype.byAdmin = function () {
    return this.by({ id: id(), role: "Admin" })
}

SuperAgentRequest.prototype.byAnyUser = function () {
    return this.by({ id: id(), role: "User" })
}

SuperAgentRequest.prototype.columns = function (columns: string[]) {
    return this.expect((resp: Response) => {
        expect(Object.keys(resp.body).sort()).toMatchObject(columns.sort())
    })
}

