import { DynamoDBSingleTableItem } from '.';
import DynamoDBClient from './DynamoDBClient';

export default class DynamoDBSingleTableClient {

    constructor(private dynamoDBClient: DynamoDBClient) {
        this.dynamoDBClient.partitionKeyName = 'partitionKey';
        this.dynamoDBClient.sortKeyName = 'sortKey';
    }

    async getAsync<T extends object>(partitionKey: string, sortKey?: string): Promise<T | undefined> {

        const item = await this.dynamoDBClient
            .getAsync<DynamoDBSingleTableItem>({
                partitionKey,
                sortKey
            });

        return item === undefined
            ? undefined
            : DynamoDBSingleTableItem.getEntity<T>(item);
    }

    async putAsync<T extends object>(
        itemType: string,
        partitionKeyName: keyof T,
        sortKeyName: keyof T,
        entity: T
    ): Promise<void> {

        const singleTableItem = DynamoDBSingleTableItem.getItem(itemType, partitionKeyName, sortKeyName, entity);

        await this.dynamoDBClient.putAsync(singleTableItem);
    }

    async queryByPartitionKeyAsync<T extends object>(keyValue: string): Promise<T[]> {

        const singleTableItems = 
            await this.dynamoDBClient.queryByPartitionKeyAsync<DynamoDBSingleTableItem>(keyValue);

        const entities = singleTableItems.map(i => DynamoDBSingleTableItem.getEntity<T>(i));

        return entities;
    }

    async queryByIndexAsync<T extends object>(
        indexName: string, 
        partitionKey: {name: string; value: string},
        sortKey?: {name: string; value: string},
    ): Promise<T[]> {

        const singleTableItems = 
            await this.dynamoDBClient
                .queryByIndexAsync<DynamoDBSingleTableItem>(
                    indexName, partitionKey, sortKey
                );

        const entities = singleTableItems.map(i => DynamoDBSingleTableItem.getEntity<T>(i));

        return entities;
    }
}
