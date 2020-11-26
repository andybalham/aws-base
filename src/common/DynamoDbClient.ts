import { DocumentClient, PutItemInput } from 'aws-sdk/clients/dynamodb';

export default class DynamoDbClient {

    constructor(private documentClient?: DocumentClient, private tableName?: string) {
    }

    async get<T>(key: any): Promise<T | undefined> {

        if (this.documentClient === undefined) throw new Error('this.documentClient === undefined');
        if (this.tableName === undefined) throw new Error('this.tableName === undefined');

        const itemOutput = 
            await this.documentClient.get({TableName: this.tableName, Key: key}).promise();

        return itemOutput.Item === undefined 
            ? undefined 
            : itemOutput.Item as T;
    }

    async put(item: any): Promise<void> {

        if (this.documentClient === undefined) throw new Error('this.documentClient === undefined');
        if (this.tableName === undefined) throw new Error('this.tableName === undefined');

        const putItem: PutItemInput = 
            {
                TableName: this.tableName,
                Item: item,
            };    

        this.documentClient.put(putItem).promise();
    }
}

