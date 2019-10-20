import { route, val } from "plumier"

import { Todo, TodoModel } from "../../../model/model"

export class TodosController {
    @route.get("")
    all(@val.optional() offset: number, @val.optional() limit: number) {
        return TodoModel.find({ deleted: false })
            .limit(limit)
            .skip(offset)
    }

    @route.get(":id")
    get(@val.mongoId() id: string) {
        return TodoModel.findById(id)
    }

    @route.post("")
    save(data: Todo) {
        return new TodoModel({ ...data, completed:false }).save()
    }

    @route.put(":id")
    @route.patch(":id")
    update(@val.mongoId() id: string, @val.partial(Todo) data: Partial<Todo>) {
        return TodoModel.findByIdAndUpdate(id, data)
    }

    @route.delete(":id")
    delete(@val.mongoId() id: string) {
        return TodoModel.findByIdAndUpdate(id, { deleted: true })
    }
}