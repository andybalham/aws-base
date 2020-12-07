import { S3Event, S3EventRecord } from 'aws-lambda/trigger/s3';
import SNSFunction from '../../common/SNSFunction';
import S3Function from '../../common/S3Function';
import { Document } from '../../services';
import S3Client from '../../common/S3Client';
import DynamoDBClient from '../../common/DynamoDBClient';
import { FileIndex } from '../../domain/fileIndex';

export default class DocumentIndexerFunction extends SNSFunction<S3Event> {

    private readonly s3Handler: S3Handler;

    constructor(s3Client: S3Client, fileIndexDynamoDbClient: DynamoDBClient) {        
        super();
        this.s3Handler = new S3Handler(s3Client, fileIndexDynamoDbClient);
    }

    async handleMessage(s3Event: S3Event): Promise<void> {
        await this.s3Handler.handle(s3Event, this.context);
    }
}

class S3Handler extends S3Function {

    constructor(private s3Client: S3Client, private fileIndexDynamoDbClient: DynamoDBClient) {
        super();
    }
    
    async handleEventRecord(eventRecord: S3EventRecord): Promise<void> {

        const document: Document = 
            await this.s3Client.getJsonObject(eventRecord.s3.object.key, eventRecord.s3.bucket.name);

        const fileIndexKey = {
            documentType: document.metadata.type,
            documentId: document.metadata.id
        };

        // TODO 07Dec20: Do we need to load and check the eTag? Can we just compare before and after from the DynamoDB stream?

        const currentFileIndex = await this.fileIndexDynamoDbClient.get<FileIndex>(fileIndexKey);

        if (eventRecord.s3.object.eTag !== currentFileIndex?.s3ETag) {

            const newFileIndex: FileIndex = {
                ...fileIndexKey,
                s3BucketName: eventRecord.s3.bucket.name,
                s3Key: eventRecord.s3.object.key,
                s3ETag: eventRecord.s3.object.eTag,
                description: document.metadata.description
            };

            await this.fileIndexDynamoDbClient.put(newFileIndex);

            console.log(`Updated fileIndexKey: ${JSON.stringify(fileIndexKey)}`);
        }
    }
}