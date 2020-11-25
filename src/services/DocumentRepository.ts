import S3 from 'aws-sdk/clients/s3';
import S3Client from '../common/S3Client';

export default class DocumentRepository {

    private readonly s3Client: S3Client;

    constructor(
        s3?: S3,
        documentBucket?: string,
    ) {
        this.s3Client = new S3Client(s3, documentBucket);
    }

    async putContent(metadata: DocumentMetadata, content: any): Promise<void> {

        let documentKey: string;

        switch (metadata.type) {

        case DocumentType.configuration:
            documentKey = `configuration/configuration_${metadata.id}.json`;
            break;
        
        default:
            throw new Error(`Unhandled document type: ${metadata.type}`);
        }

        const document: Document = {
            metadata,
            content: content,
        };

        await this.s3Client.putJsonObject(documentKey, document);
    }

    async getContent<T>(id: string, type: DocumentType): Promise<T> {

        // TODO 16Nov20: Load the key from the DynamoDB index

        let documentKey: string;

        switch (type) {

        case 'configuration':
            documentKey = `configuration/configuration_${id}.json`;
            break;
        
        default:
            throw new Error(`Unhandled document type: ${type}`);
        }

        const document = await this.s3Client.getJsonObject<Document>(documentKey);
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
