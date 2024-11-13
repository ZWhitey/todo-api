import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {TodoItem} from '../models';
import {TodoItemRepository} from '../repositories';

export class TodoItemController {
  constructor(
    @repository(TodoItemRepository)
    public todoItemRepository: TodoItemRepository,
  ) {}

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
    @param.filter(TodoItem, {exclude: 'where'})
    filter?: FilterExcludingWhere<TodoItem>,
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

  @del('/todo-items/{id}')
  @response(204, {
    description: 'TodoItem DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoItemRepository.deleteById(id);
  }
}
