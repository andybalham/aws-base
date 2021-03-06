export default class DynamoDBSingleTableItem {
  PK: string;
  SK: string;
  ITEM_TYPE: string;

  static getItem<T extends object>(
    entity: T,
    type: string,
    partitionKeyName: keyof T,
    sortKeyName: keyof T
  ): DynamoDBSingleTableItem {
    const item: DynamoDBSingleTableItem = {
      PK: (entity[partitionKeyName] as unknown) as string,
      SK: (entity[sortKeyName] as unknown) as string,
      ITEM_TYPE: type,
    };

    Object.assign(item, entity);

    return item;
  }

  static getEntity<T extends object>(item: DynamoDBSingleTableItem): T {
    const entity: any = {};

    Object.assign(entity, item);

    delete entity.PK;
    delete entity.SK;
    delete entity.ITEM_TYPE;

    return entity;
  }
}
