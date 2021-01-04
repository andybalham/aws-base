import { DynamoDBClient, S3Client } from '../common';
import { Configuration } from '../domain/configuration';
import { DocumentType, DocumentMetadata, DocumentIndex, Document } from '../domain/document';
import { Application } from '../domain/input';
import { Product } from '../domain/product';

export default class DocumentRepository {

    constructor(private contentClient: S3Client, private indexClient: DynamoDBClient) {}

    async putContent(metadata: DocumentMetadata, content: any): Promise<void> {

        const documentKey = `${metadata.type}/${metadata.type}_${metadata.id}.json`;

        const document: Document = {
            metadata,
            content,
        };

        await this.contentClient.putJsonObject(documentKey, document);
    }

    async getConfiguration(id: string): Promise<Configuration> {
        return await this.getContent(id, DocumentType.Configuration);
    }

    async getScenario(id: string): Promise<Application> {
        return await this.getContent(id, DocumentType.Scenario);
    }

    async getProduct(id: string): Promise<Product> {
        return await this.getContent(id, DocumentType.Product);
    }

    async getContent<T>(id: string, type: DocumentType): Promise<T> {

        const indexKey = { documentType: type, documentId: id };

        const documentIndex = await this.indexClient.get<DocumentIndex>(indexKey);

        if (documentIndex === undefined) {
            throw new Error(`No document found for indexKey: ${JSON.stringify(indexKey)}`);
        }

        const document = 
            await this.contentClient.getJsonObject<Document>(documentIndex.s3Key, documentIndex.s3BucketName);

        return document.content;
    }

    async listConfigurations(): Promise<DocumentIndex[]> {
        return await this.listIndexesByDocumentType(DocumentType.Configuration);
    }

    async listScenarios(): Promise<DocumentIndex[]> {
        return await this.listIndexesByDocumentType(DocumentType.Scenario);
    }

    async listProducts(): Promise<DocumentIndex[]> {
        return await this.listIndexesByDocumentType(DocumentType.Product);
    }

    private async listIndexesByDocumentType(type: DocumentType): Promise<DocumentIndex[]> {
        const indexesByDocumentType = await this.indexClient.queryByPartitionKey<DocumentIndex>(type);
        return indexesByDocumentType;
    }
}