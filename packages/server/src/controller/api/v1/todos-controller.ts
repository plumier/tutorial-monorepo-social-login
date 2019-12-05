import { route, val } from "plumier"

import { Todo, TodoModel } from "../../../model"

export class TodosController {
    //GET /api/v1/todos?offset&limit
    @route.get("")
    all(offset: number, limit: number) {
        return TodoModel.find({ deleted: false })
            .limit(limit)
            .skip(offset)
    }

    //GET /api/v1/todos/:id
    @route.get(":id")
    get(@val.mongoId() id: string) {
        return TodoModel.findById(id)
    }

    //POST /api/v1/todos
    @route.post("")
    save(data: Todo) {
        return new TodoModel({ ...data, completed:false }).save()
    }

    //PUT PATCH /api/v1/todos/:id
    @route.put(":id")
    @route.patch(":id")
    update(@val.mongoId() id: string, @val.partial(Todo) data: Partial<Todo>) {
        return TodoModel.findByIdAndUpdate(id, data)
    }

    //DELETE /api/v1/todos/:id
    @route.delete(":id")
    delete(@val.mongoId() id: string) {
        return TodoModel.findByIdAndUpdate(id, { deleted: true })
    }
}