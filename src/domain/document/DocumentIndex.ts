import { DocumentType } from './DocumentType';

export class DocumentIndex {
    documentType: DocumentType;
    documentId: string;
    description?: string;
    s3BucketName: string;
    s3Key: string;
    s3ETag: string;
}
