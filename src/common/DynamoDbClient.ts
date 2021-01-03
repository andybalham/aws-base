import { DocumentClient, PutItemInput } from 'aws-sdk/clients/dynamodb';
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
        private tableName?: string, 
        private partitionKeyName?: string, 
        documentClientOverride?: DocumentClient
    ) {
        this.documentClient = documentClientOverride ?? documentClient;
    }

    async get<T>(key: {[key: string]: any}): Promise<T | undefined> {

        if (this.tableName === undefined) throw new Error('this.tableName === undefined');

        const itemOutput = 
            await this.documentClient.get({TableName: this.tableName, Key: key}).promise();

        return itemOutput.Item === undefined 
            ? undefined 
            : itemOutput.Item as T;
    }

    async put(item: any): Promise<void> {

        if (this.tableName === undefined) throw new Error('this.tableName === undefined');

        const putItem: PutItemInput = 
            {
                TableName: this.tableName,
                Item: item,
            };    

        this.documentClient.put(putItem).promise();
    }

    async queryByPartitionKey<T>(keyValue: string): Promise<T[]> {

        if (this.tableName === undefined) throw new Error('this.tableName === undefined');
        if (this.partitionKeyName === undefined) throw new Error('this.partitionKeyName === undefined');

        const queryOutput = 
            await this.documentClient.query({
                TableName: this.tableName,
                KeyConditionExpression: `${this.partitionKeyName} = :partitionKey`,
                ExpressionAttributeValues: {
                    ':partitionKey': keyValue,
                }
            }).promise();

        if (!queryOutput.Items) {
            return [];
        }

        return queryOutput.Items.map(i => i as T);
    }
}

