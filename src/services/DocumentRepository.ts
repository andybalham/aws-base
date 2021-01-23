import { DynamoDBSingleTableClient, S3Client } from '../common';
import { DocumentContentType, DocumentHash, DocumentIndex } from '../domain/document';
import { customAlphabet } from 'nanoid';
import { Configuration } from '../domain/configuration';
import { Product } from '../domain/product';
import { Application } from '../domain/input';

const nanoid = customAlphabet('1234567890abcdef0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);

export default class DocumentRepository {

    // TODO 06Jan21: YAML example for a GSI https://jun711.github.io/aws/how-to-create-aws-dynamodb-secondary-indexes/

    constructor(private contentClient: S3Client, private metadataClient: DynamoDBSingleTableClient) {}

    async putContentAsync(index: {contentType: DocumentContentType; id?: string; description?: string}, content: any): Promise<string> {

        const id = index.id ?? nanoid();
        const contentS3Key = `${index.contentType}/${index.contentType}_${id}.json`;
        
        if (this.contentClient.bucketName === undefined) throw new Error('this.contentClient.bucketName === undefined');

        const contentIndex: DocumentIndex = {
            contentType: index.contentType,
            id,
            s3BucketName: this.contentClient.bucketName,
            s3Key: contentS3Key,
            description: index.description,
        };    

        await this.metadataClient.putAsync('index', 'contentType', 'id', contentIndex);
        await this.contentClient.putObjectAsync(contentS3Key, content);

        return id;
    }

    async getConfigurationAsync(id: string): Promise<Configuration> {
        return await this.getContentAsync<Configuration>(DocumentContentType.Configuration, id);
    }

    async getProductAsync(id: string): Promise<Product> {
        return await this.getContentAsync<Product>(DocumentContentType.Product, id);
    }

    async getApplicationAsync(id: string): Promise<Application> {
        return await this.getContentAsync<Application>(DocumentContentType.Scenario, id);
    }

    async getIndexByS3Async(s3BucketName: string, s3Key: string): Promise<DocumentIndex> {

        const indexes =
            await this.metadataClient.queryByIndexAsync<DocumentIndex>(
                'S3', 
                {name: 's3BucketName', value: s3BucketName}, 
                {name: 's3Key', value: s3Key}, 
            );

        if (indexes.length !== 1) {
            throw new Error(`Found ${indexes.length} indexes when 1 was expected: ${JSON.stringify({s3BucketName, s3Key})}`);
        }

        return indexes[0];
    }

    async getContentAsync<T extends object>(contentType: DocumentContentType, id: string): Promise<T> {

        const indexKey = { partitionKey: contentType, sortKey: id };

        const index = await this.metadataClient.getAsync<DocumentIndex>(contentType, id);

        if (index === undefined) {
            throw new Error(`No document found for indexKey: ${JSON.stringify(indexKey)}`);
        }

        const content = await this.contentClient.getObjectAsync<T>(index.s3Key, index.s3BucketName);

        return content;
    }

    async putHashAsync(hash: DocumentHash): Promise<void> {
        await this.metadataClient.putAsync('hash', 's3BucketName', 's3Key', hash);
    }

    async listConfigurationsAsync(): Promise<DocumentIndex[]> {
        return await this.listIndexesByDocumentTypeAsync(DocumentContentType.Configuration);
    }

    async listScenariosAsync(): Promise<DocumentIndex[]> {
        return await this.listIndexesByDocumentTypeAsync(DocumentContentType.Scenario);
    }

    async listProductsAsync(): Promise<DocumentIndex[]> {
        return await this.listIndexesByDocumentTypeAsync(DocumentContentType.Product);
    }

    private async listIndexesByDocumentTypeAsync(contentType: DocumentContentType): Promise<DocumentIndex[]> {
        const indexesByDocumentType = 
            await this.metadataClient.queryByPartitionKeyAsync<DocumentIndex>(contentType);
        return indexesByDocumentType;
    }
}