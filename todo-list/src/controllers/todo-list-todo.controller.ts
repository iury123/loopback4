import { repository, CountSchema, Filter, Where } from "@loopback/repository";
import { get, getModelSchemaRef, param, post, requestBody, patch, getWhereSchemaFor } from "@loopback/rest";
import { Todo } from "../models";
import { TodoListRepository } from "../repositories";
import { Count } from "loopback-datasource-juggler";

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


export class TodoListTodoController {
  constructor(
    @repository(TodoListRepository)
    protected todoListRepo: TodoListRepository
  ) { }

  @post('/todo-lists/{id}/todos')
  async create(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, { exclude: ['id'] }),
        },
      },
    })
    todo: Omit<Todo, 'id'>,
  ) {
    return this.todoListRepo.todos(id).create(todo);
    // return {
    //   code: 404,
    //   message: 'Deu ruim'
    // }
  }


  @get('/todo-lists/{id}/todos', {
    responses: {
      '200': {
        description: "Array of Todo's belonging to TodoList",
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Todo) },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Todo>,
  ): Promise<Todo[]> {
    return this.todoListRepo.todos(id).find(filter);
  }


  @patch('/todo-lists/{id}/todos', {
    responses: {
      '200': {
        description: 'TodoList.Todo PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, { partial: true }),
        },
      },
    })
    todo: Partial<Todo>,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoListRepo.todos(id).patch(todo, where);
  }
}
