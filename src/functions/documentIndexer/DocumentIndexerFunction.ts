import { S3Event, S3EventRecord } from 'aws-lambda/trigger/s3';
import SNSFunction from '../../common/SNSFunction';
import S3Function from '../../common/S3Function';
import { Document } from '../../services';
import S3Client from '../../common/S3Client';
import DynamoDBClient from '../../common/DynamoDBClient';
import { DocumentIndex } from '../../domain/documentIndex';
import Log from '@dazn/lambda-powertools-logger';

export default class DocumentIndexerFunction extends SNSFunction<S3Event> {

    private readonly s3Handler: S3Handler;

    constructor(s3Client: S3Client, documentIndexDynamoDbClient: DynamoDBClient) {        
        super();
        this.s3Handler = new S3Handler(s3Client, documentIndexDynamoDbClient);
    }

    async handleMessage(s3Event: S3Event): Promise<void> {
        await this.s3Handler.handle(s3Event, this.context);
    }
}

class S3Handler extends S3Function {

    constructor(private s3Client: S3Client, private documentIndexDynamoDbClient: DynamoDBClient) {
        super();
    }
    
    async handleEventRecord(eventRecord: S3EventRecord): Promise<void> {

        const document: Document = 
            await this.s3Client.getJsonObject(eventRecord.s3.object.key, eventRecord.s3.bucket.name);

        const newDocumentIndex: DocumentIndex = {
            documentType: document.metadata.type,
            documentId: document.metadata.id,
            description: document.metadata.description,
            s3BucketName: eventRecord.s3.bucket.name,
            s3Key: eventRecord.s3.object.key,
            s3ETag: eventRecord.s3.object.eTag,
        };

        await this.documentIndexDynamoDbClient.put(newDocumentIndex);

        Log.info('Put document index', {newDocumentIndex});
    }
}