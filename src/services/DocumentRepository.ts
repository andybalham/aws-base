import { DynamoDBClient, S3Client } from '../common';
import { DocumentContentType, DocumentContentIndex } from '../domain/document';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);

export default class DocumentRepository {

    // TODO 06Jan21: YAML example for a GSI https://jun711.github.io/aws/how-to-create-aws-dynamodb-secondary-indexes/

    constructor(private contentClient: S3Client, private indexClient: DynamoDBClient) {}

    async put(index: {contentType: DocumentContentType; id?: string; description?: string}, content: any): Promise<string> {

        const id = index.id ?? nanoid();
        const contentS3Key = `${index.contentType}/${index.contentType}_${id}.json`;
        
        if (this.contentClient.bucketName === undefined) throw new Error('this.contentClient.bucketName === undefined');

        const contentIndex: DocumentContentIndex = {
            id,
            contentType: index.contentType,
            s3BucketName: this.contentClient.bucketName,
            s3Key: contentS3Key,
            description: index.description,
        };    

        await this.indexClient.put(contentIndex);
        await this.contentClient.putJsonObject(contentS3Key, content);

        return id;
    }

    async putIndex(index: DocumentContentIndex): Promise<string> {

        index.id = index.id ?? nanoid();

        await this.indexClient.put(index);

        return index.id;
    }

    async get<T>(id: string): Promise<{index: DocumentContentIndex; content: T}> {

        const indexKey = { id };

        const index = await this.indexClient.get<DocumentContentIndex>(indexKey);

        if (index === undefined) {
            throw new Error(`No document found for indexKey: ${JSON.stringify(indexKey)}`);
        }

        const content = await this.contentClient.getJsonObject<T>(index.s3Key, index.s3BucketName);

        return { index, content};
    }

    async getIndexByS3Details<T>(bucketName: string, key: string): Promise<DocumentContentIndex> {

        const indexes = 
            await this.indexClient.queryByIndex<DocumentContentIndex>(
                'S3', 
                { name: 's3BucketName', value: bucketName}, 
                { name: 's3Key', value: key}
            );

        if (indexes.length !== 1) {
            throw new Error(`${indexes.length}} indexes found when one was expected: ${JSON.stringify({bucketName, key})}`);
        }

        return indexes[0];
    }

    async listConfigurations(): Promise<DocumentContentIndex[]> {
        return await this.listIndexesByDocumentType(DocumentContentType.Configuration);
    }

    async listScenarios(): Promise<DocumentContentIndex[]> {
        return await this.listIndexesByDocumentType(DocumentContentType.Scenario);
    }

    async listProducts(): Promise<DocumentContentIndex[]> {
        return await this.listIndexesByDocumentType(DocumentContentType.Product);
    }

    private async listIndexesByDocumentType(contentType: DocumentContentType): Promise<DocumentContentIndex[]> {
        const indexesByDocumentType = 
            await this.indexClient.queryByIndex<DocumentContentIndex>('ContentType', { name: 'contentType', value: contentType});
        return indexesByDocumentType;
    }
}