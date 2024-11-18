import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {Todo, TodoItem} from '../models';
import {TodoRepository} from '../repositories';
import {TodoStatus} from '../services';

export class TodoTodoItemController {
  constructor(
    @repository(TodoRepository) protected todoRepository: TodoRepository,
  ) {}

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
    const todo = await this.todoRepository.findById(id);
    if (todo.status === TodoStatus.DELETED) {
      throw new HttpErrors.NotFound(`Entity not found: Todo with id ${id}`);
    }
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
            exclude: ['id', 'todoId', 'finishAt'],
          }),
        },
      },
    })
    todoItem: Omit<TodoItem, 'id'>,
  ): Promise<TodoItem> {
    const todo = await this.todoRepository.findById(id);
    if (todo.status === TodoStatus.DELETED) {
      throw new HttpErrors.NotFound(`Entity not found: Todo with id ${id}`);
    }
    return this.todoRepository.todoItems(id).create(todoItem);
  }
}
