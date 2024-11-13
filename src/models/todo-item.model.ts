import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      todoId: {
        name: 'fk_todo_item_todo_id',
        foreignKey: 'todoId',
        entityKey: 'id',
        entity: 'Todo',
      },
    },
  },
})
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

  @property({
    type: 'number',
  })
  todoId?: number;

  constructor(data?: Partial<TodoItem>) {
    super(data);
  }
}

export interface TodoItemRelations {
  // describe navigational properties here
}

export type TodoItemWithRelations = TodoItem & TodoItemRelations;
