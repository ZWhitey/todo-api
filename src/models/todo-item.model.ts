import {Entity, model, property} from '@loopback/repository';

@model()
export class TodoItem extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'boolean',
    required: true,
  })
  done: boolean;

  @property({
    type: 'date',
  })
  finishAt?: string;


  constructor(data?: Partial<TodoItem>) {
    super(data);
  }
}

export interface TodoItemRelations {
  // describe navigational properties here
}

export type TodoItemWithRelations = TodoItem & TodoItemRelations;
