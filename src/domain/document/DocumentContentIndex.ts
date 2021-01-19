import { DocumentContentType } from './DocumentType';

export class DocumentContentIndex {
    id: string;
    contentType: DocumentContentType;
    description?: string;
    s3BucketName: string;
    s3Key: string;
    s3ETag?: string;
}
