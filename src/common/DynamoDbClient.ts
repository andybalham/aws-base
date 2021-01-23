import { DocumentClient, PutItemInput, QueryInput } from 'aws-sdk/clients/dynamodb';
import https from 'https';

const agent = new https.Agent({
    keepAlive: true
});

const documentClient = new DocumentClient({
    httpOptions: {
        agent
    }
});

export default class DynamoDBClient {

    private documentClient: DocumentClient;

    constructor(
        public readonly tableName?: string, 
        public partitionKeyName?: string, 
        public sortKeyName?: string, 
        documentClientOverride?: DocumentClient
    ) {
        this.documentClient = documentClientOverride ?? documentClient;
    }

    async getAsync<T>(key: {[key: string]: any}): Promise<T | undefined> {

        if (this.tableName === undefined) throw new Error('this.tableName === undefined');

        const itemOutput = 
            await this.documentClient.get({TableName: this.tableName, Key: key}).promise();

        return itemOutput.Item === undefined 
            ? undefined 
            : itemOutput.Item as T;
    }

    async putAsync(item: any): Promise<void> {

        if (this.tableName === undefined) throw new Error('this.tableName === undefined');

        const putItem: PutItemInput = 
            {
                TableName: this.tableName,
                Item: item,
            };    

        this.documentClient.put(putItem).promise();
    }

    async queryByPartitionKeyAsync<T>(keyValue: string): Promise<T[]> {

        if (this.tableName === undefined) throw new Error('this.tableName === undefined');
        if (this.partitionKeyName === undefined) throw new Error('this.partitionKeyName === undefined');

        const queryParams: QueryInput = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.partitionKeyName} = :partitionKey`,
            ExpressionAttributeValues: {
                ':partitionKey': { S: keyValue },
            }
        };

        const queryOutput = await this.documentClient.query(queryParams).promise();

        if (!queryOutput.Items) {
            return [];
        }

        return queryOutput.Items.map(i => i as T);
    }

    async queryByIndexAsync<T>(
        indexName: string, 
        partitionKey: {name: string; value: string},
        sortKey?: {name: string; value: string},
    ): Promise<T[]> {

        if (this.tableName === undefined) throw new Error('this.tableName === undefined');

        let keyConditionExpression = `${partitionKey.name} = :partitionKey`;
        const expressionAttributeValues = {
            ':partitionKey': partitionKey.value,
        };

        if (sortKey) {
            keyConditionExpression += ` AND ${sortKey.name} = :sortKey`;
            expressionAttributeValues[':sortKey'] = sortKey.value;
        }

        const queryParams = {
            TableName: this.tableName,
            IndexName: indexName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues
        };

        const queryOutput = await this.documentClient.query(queryParams).promise();

        if (!queryOutput.Items) {
            return [];
        }

        return queryOutput.Items.map(i => i as T);
    }
}


