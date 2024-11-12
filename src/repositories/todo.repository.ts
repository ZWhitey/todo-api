import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Todo, TodoRelations, TodoItem} from '../models';
import {TodoItemRepository} from './todo-item.repository';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {

  public readonly todoItems: HasManyRepositoryFactory<TodoItem, typeof Todo.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TodoItemRepository') protected todoItemRepositoryGetter: Getter<TodoItemRepository>,
  ) {
    super(Todo, dataSource);
    this.todoItems = this.createHasManyRepositoryFactoryFor('todoItems', todoItemRepositoryGetter,);
    this.registerInclusionResolver('todoItems', this.todoItems.inclusionResolver);
  }
}
