export default class DynamoDBSingleTableItem {
    
    itemType: string;
    partitionKey: string; 
    sortKey: string;

    static getItem<T extends object>(
        entity: T,
        itemType: string, 
        partitionKeyName: keyof T, 
        sortKeyName: keyof T,
    ): DynamoDBSingleTableItem {
        
        const item: DynamoDBSingleTableItem = {
            partitionKey: entity[partitionKeyName] as unknown as string,
            sortKey: entity[sortKeyName] as unknown as string,
            itemType: itemType,
        };

        Object.assign(item, entity);

        return item;
    }

    static getEntity<T extends object>(
        item: DynamoDBSingleTableItem
    ): T {
        
        const entity: any = {};

        Object.assign(entity, item);

        delete entity.partitionKey;
        delete entity.sortKey;
        delete entity.itemType;

        return entity;
    }
}
