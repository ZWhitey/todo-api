import {service} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import _ from 'lodash';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';
import {
  CreateTodoProps,
  TodoService,
  TodoStatus,
} from '../services/todo.service';

export class TodoController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
    @service(TodoService)
    public todoService: TodoService,
  ) {}

  @post('/todos')
  @response(200, {
    description: 'Todo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: {type: 'string'},
              subtitle: {type: 'string'},
              todoItems: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    content: {type: 'string'},
                  },
                  required: ['content'],
                },
              },
            },
            required: ['title', 'todoItems'],
          },
        },
      },
    })
    todo: CreateTodoProps,
  ): Promise<Todo> {
    return this.todoService.createTodo(todo);
  }

  @get('/todos')
  @response(200, {
    description: 'Array of Todo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Todo, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Todo) filter?: Filter<Todo>): Promise<Todo[]> {
    return this.todoRepository.find(filter);
  }

  @get('/todos/{id}')
  @response(200, {
    description: 'Todo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Todo> {
    return this.todoRepository.findById(id, {
      include: [{relation: 'todoItems'}],
    });
  }

  @patch('/todos/{id}')
  @response(204, {
    description: 'Todo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            partial: true,
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    todo: Todo,
  ): Promise<void> {
    todo.updatedAt = new Date().toISOString();
    if (
      !_.isNil(todo.status) &&
      !_.includes([TodoStatus.ACTIVE, TodoStatus.INACTIVE], todo.status)
    ) {
      throw new HttpErrors.BadRequest('Invalid status');
    }
    await this.todoRepository.updateById(id, todo);
  }

  @del('/todos/{id}')
  @response(204, {
    description: 'Todo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoRepository.updateById(id, {status: TodoStatus.DELETED});
  }
}
