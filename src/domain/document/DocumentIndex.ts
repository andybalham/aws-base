import { DocumentContentType } from './DocumentType';

export default class DocumentIndex {
    contentType: DocumentContentType;
    id: string;
    description?: string;
    s3BucketName: string;
    s3Key: string;
}


