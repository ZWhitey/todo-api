import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TodoItem, TodoItemRelations} from '../models';

export class TodoItemRepository extends DefaultCrudRepository<
  TodoItem,
  typeof TodoItem.prototype.id,
  TodoItemRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(TodoItem, dataSource);
  }
}
