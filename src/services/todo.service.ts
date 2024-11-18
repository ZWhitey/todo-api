import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository, Transaction} from '@loopback/repository';
import _ from 'lodash';
import {TodoItem} from '../models';
import {Todo} from '../models/todo.model';
import {TodoItemRepository, TodoRepository} from '../repositories';

export enum TodoStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export interface CreateTodoProps {
  title: string;
  subtitle?: string;
  todoItems?: Array<CreateTodoItemProps>;
}

export type CreateTodoItemProps = {
  content: string;
};

@injectable({scope: BindingScope.TRANSIENT})
export class TodoService {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
    @repository(TodoItemRepository)
    public todoItemRepository: TodoItemRepository,
  ) {}

  async createTodo(todo: CreateTodoProps): Promise<Todo> {
    if (_.isNil(todo.title)) {
      throw new Error('Title is required');
    }
    const tx = await this.todoRepository.beginTransaction();
    try {
      const todoItems = todo.todoItems;
      todo = _.omit(todo, ['todoItems']);

      const now = new Date().toISOString();
      const newTodo = await this.todoRepository.create(
        _.merge(todo, {
          createdAt: now,
          updatedAt: now,
          status: TodoStatus.ACTIVE,
        }),
        {transaction: tx},
      );

      if (_.isNil(newTodo.id)) {
        throw new Error('Create todo failed');
      }

      if (_.isArray(todoItems)) {
        newTodo.todoItems = [];
        for (const item of todoItems) {
          const newTodoItem = await this.createTodoItem(newTodo.id, item, tx);
          newTodo.todoItems.push(newTodoItem);
        }
      }
      await tx.commit();
      return newTodo;
    } catch (error) {
      if (tx.isActive()) {
        await tx.rollback();
      }
      throw error;
    }
  }

  async createTodoItem(
    todoId: number,
    todoItem: CreateTodoItemProps,
    tx: Transaction,
  ): Promise<TodoItem> {
    if (_.isNil(todoItem.content)) {
      throw new Error('Content is required');
    }
    if (_.isNil(todoId)) {
      throw new Error('TodoId is required');
    }
    return this.todoRepository
      .todoItems(todoId)
      .create(_.merge(todoItem, {done: false}), {transaction: tx});
  }

  /*
   * Add service methods here
   */
}
