export default class DocumentIndex {
    documentType: string;
    documentId: string;
    description?: string;
    s3BucketName: string;
    s3Key: string;
    s3ETag: string;
}