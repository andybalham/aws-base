import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDBSingleTableItem } from '.';
import DynamoDBClient from './DynamoDBClient';

export default class DynamoDBSingleTableClient {

    private dynamoDBClient: DynamoDBClient;

    constructor(
        public readonly tableName?: string, 
        documentClientOverride?: DocumentClient
    ) {
        this.dynamoDBClient = 
            new DynamoDBClient(tableName, 'partitionKey', 'sortKey', documentClientOverride);
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

        const singleTableItem = 
            DynamoDBSingleTableItem.getItem(entity, itemType, partitionKeyName, sortKeyName);

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
