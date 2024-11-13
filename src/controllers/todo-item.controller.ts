import {repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import _ from 'lodash';
import {TodoItem} from '../models';
import {TodoItemRepository, TodoRepository} from '../repositories';
import {TodoStatus} from '../services';

export class TodoItemController {
  constructor(
    @repository(TodoItemRepository)
    public todoItemRepository: TodoItemRepository,
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
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
  async findById(@param.path.number('id') id: number): Promise<TodoItem> {
    return this.todoItemRepository.findById(id);
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
          schema: getModelSchemaRef(TodoItem, {
            partial: true,
            exclude: ['todoId', 'finishAt'],
          }),
        },
      },
    })
    todoItem: TodoItem,
  ): Promise<void> {
    const item = await this.todoItemRepository.findById(id);
    const todo = await this.todoRepository.findById(item.todoId);
    if (todo.status === TodoStatus.DELETED) {
      throw new HttpErrors.NotFound(
        `Entity not found: Todo with id ${item.todoId}`,
      );
    }
    if (!_.isNil(todoItem.done) && todoItem.done) {
      todoItem.finishAt = new Date().toISOString();
    }
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
