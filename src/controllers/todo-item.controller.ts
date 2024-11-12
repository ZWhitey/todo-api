import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {TodoItem} from '../models';
import {TodoItemRepository} from '../repositories';

export class TodoItemController {
  constructor(
    @repository(TodoItemRepository)
    public todoItemRepository : TodoItemRepository,
  ) {}

  @post('/todo-items')
  @response(200, {
    description: 'TodoItem model instance',
    content: {'application/json': {schema: getModelSchemaRef(TodoItem)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoItem, {
            title: 'NewTodoItem',
            exclude: ['id'],
          }),
        },
      },
    })
    todoItem: Omit<TodoItem, 'id'>,
  ): Promise<TodoItem> {
    return this.todoItemRepository.create(todoItem);
  }

  @get('/todo-items/count')
  @response(200, {
    description: 'TodoItem model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TodoItem) where?: Where<TodoItem>,
  ): Promise<Count> {
    return this.todoItemRepository.count(where);
  }

  @get('/todo-items')
  @response(200, {
    description: 'Array of TodoItem model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TodoItem, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TodoItem) filter?: Filter<TodoItem>,
  ): Promise<TodoItem[]> {
    return this.todoItemRepository.find(filter);
  }

  @patch('/todo-items')
  @response(200, {
    description: 'TodoItem PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoItem, {partial: true}),
        },
      },
    })
    todoItem: TodoItem,
    @param.where(TodoItem) where?: Where<TodoItem>,
  ): Promise<Count> {
    return this.todoItemRepository.updateAll(todoItem, where);
  }

  @get('/todo-items/{id}')
  @response(200, {
    description: 'TodoItem model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TodoItem, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TodoItem, {exclude: 'where'}) filter?: FilterExcludingWhere<TodoItem>
  ): Promise<TodoItem> {
    return this.todoItemRepository.findById(id, filter);
  }

  @patch('/todo-items/{id}')
  @response(204, {
    description: 'TodoItem PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TodoItem, {partial: true}),
        },
      },
    })
    todoItem: TodoItem,
  ): Promise<void> {
    await this.todoItemRepository.updateById(id, todoItem);
  }

  @put('/todo-items/{id}')
  @response(204, {
    description: 'TodoItem PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todoItem: TodoItem,
  ): Promise<void> {
    await this.todoItemRepository.replaceById(id, todoItem);
  }

  @del('/todo-items/{id}')
  @response(204, {
    description: 'TodoItem DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoItemRepository.deleteById(id);
  }
}
