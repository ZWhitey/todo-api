import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Todo,
  TodoItem,
} from '../models';
import {TodoRepository} from '../repositories';

export class TodoTodoItemController {
  constructor(
    @repository(TodoRepository) protected todoRepository: TodoRepository,
  ) { }

  @get('/todos/{id}/todo-items', {
    responses: {
      '200': {
        description: 'Array of Todo has many TodoItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TodoItem)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<TodoItem>,
  ): Promise<TodoItem[]> {
    return this.todoRepository.todoItems(id).find(filter);
  }

  @post('/todos/{id}/todo-items', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {'application/json': {schema: getModelSchemaRef(TodoItem)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Todo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoItem, {
            title: 'NewTodoItemInTodo',
            exclude: ['id'],
            optional: ['todoId']
          }),
        },
      },
    }) todoItem: Omit<TodoItem, 'id'>,
  ): Promise<TodoItem> {
    return this.todoRepository.todoItems(id).create(todoItem);
  }

  @patch('/todos/{id}/todo-items', {
    responses: {
      '200': {
        description: 'Todo.TodoItem PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoItem, {partial: true}),
        },
      },
    })
    todoItem: Partial<TodoItem>,
    @param.query.object('where', getWhereSchemaFor(TodoItem)) where?: Where<TodoItem>,
  ): Promise<Count> {
    return this.todoRepository.todoItems(id).patch(todoItem, where);
  }

  @del('/todos/{id}/todo-items', {
    responses: {
      '200': {
        description: 'Todo.TodoItem DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(TodoItem)) where?: Where<TodoItem>,
  ): Promise<Count> {
    return this.todoRepository.todoItems(id).delete(where);
  }
}
