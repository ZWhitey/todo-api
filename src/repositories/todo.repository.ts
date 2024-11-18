import {Getter, inject} from '@loopback/core';
import {
  DefaultTransactionalRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Todo, TodoItem, TodoRelations} from '../models';
import {TodoItemRepository} from './todo-item.repository';

export class TodoRepository extends DefaultTransactionalRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {
  public readonly todoItems: HasManyRepositoryFactory<
    TodoItem,
    typeof Todo.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TodoItemRepository')
    protected todoItemRepositoryGetter: Getter<TodoItemRepository>,
  ) {
    super(Todo, dataSource);
    this.todoItems = this.createHasManyRepositoryFactoryFor(
      'todoItems',
      todoItemRepositoryGetter,
    );
    this.registerInclusionResolver(
      'todoItems',
      this.todoItems.inclusionResolver,
    );
  }
}
