import { S3Event, S3EventRecord } from 'aws-lambda/trigger/s3';
import SQSLambda from '../../common/SQSLambda';
import S3Lambda from '../../common/S3Lambda';
import S3 from 'aws-sdk/clients/s3';
import { Document } from '../../services';
import S3Client from '../../common/S3Client';

export default class FileUpdateEventLambda extends SQSLambda<S3Event> {

    private readonly s3Handler: S3Handler;

    constructor(s3: S3) {
        super();
        this.s3Handler = new S3Handler(s3);
    }

    async handleMessage(s3Event: S3Event): Promise<void> {
        await this.s3Handler.handle(s3Event, this.context);
    }
}

class S3Handler extends S3Lambda {

    private readonly s3Client: S3Client;

    constructor(s3: S3) {
        super();
        this.s3Client = new S3Client(s3);
    }
    
    async handleEventRecord(eventRecord: S3EventRecord): Promise<void> {

        const document: Document = 
            await this.s3Client.getJsonObject(eventRecord.s3.object.key, eventRecord.s3.bucket.name);

        console.log(`document.metadata: ${JSON.stringify(document.metadata)}`);
    }
}