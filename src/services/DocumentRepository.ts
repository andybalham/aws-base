import { DynamoDBClient, S3Client } from '../common';
import { DocumentIndex } from '../domain/documentIndex';

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
}

export enum DocumentType {
    configuration = 'configuration',
    request = 'request',
    response = 'response',
    audit = 'audit',
    scenario = 'scenario',
    product = 'product',
    result = 'result',
}

export class DocumentMetadata {
    type: DocumentType;
    id: string;
    description?: string
}

export class Document {
    metadata: DocumentMetadata;
    content: any;
}
