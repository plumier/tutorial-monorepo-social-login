import { SchemaGenerator } from "@plumier/mongoose"
import mongoose from "mongoose"

export const schemaGenerator: SchemaGenerator = def => {
    if (def.deleted)
        def.deleted = { type: Boolean, default: false }
    const schema = new mongoose.Schema(def, { timestamps: true })
    schema.set("toJSON", { virtuals: true, versionKey:false })
    return schema
}