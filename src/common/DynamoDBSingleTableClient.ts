import { DynamoDBClient } from '@andybalham/agb-aws-clients';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDBSingleTableItem } from '.';

// TODO 28Feb21: Should we move this into the clients package?
export default class DynamoDBSingleTableClient {

    private dynamoDBClient: DynamoDBClient;

    constructor(
        public readonly tableName?: string, 
        documentClientOverride?: DocumentClient
    ) {
        this.dynamoDBClient = new DynamoDBClient(tableName, 'PK', 'SK', documentClientOverride);
    }

    async getAsync<T extends object>(partitionKey: string, sortKey?: string): Promise<T | undefined> {

        const item = 
            await this.dynamoDBClient
                .getAsync<DynamoDBSingleTableItem>({
                    PK: partitionKey,
                    SK: sortKey
                });

        return item === undefined
            ? undefined
            : DynamoDBSingleTableItem.getEntity<T>(item);
    }

    async putAsync<T extends object>(
        entity: T,
        itemType: string,
        partitionKeyName: keyof T,
        sortKeyName: keyof T,
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
        itemType: string, 
        partitionKey: {name: string; value: string},
        sortKey?: {name: string; value: string},
    ): Promise<T[]> {

        const singleTableItems = 
            await this.dynamoDBClient
                .queryByIndexAsync<DynamoDBSingleTableItem>(
                    indexName, partitionKey, sortKey
                );

        const entities = 
            singleTableItems
                .filter(i => i.ITEM_TYPE === itemType) // TODO 24Jan21: We should apply a filter expression
                .map(i => DynamoDBSingleTableItem.getEntity<T>(i));

        return entities;
    }
}
