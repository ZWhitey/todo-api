import {Entity, hasMany, model, property} from '@loopback/repository';
import {TodoItem} from './todo-item.model';

@model()
export class Todo extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  subtitle?: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @hasMany(() => TodoItem, {keyTo: 'todoId'})
  todoItems: TodoItem[];

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
