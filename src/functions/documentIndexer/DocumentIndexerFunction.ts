import { S3Event, S3EventRecord } from 'aws-lambda/trigger/s3';
import SNSFunction from '../../common/SNSFunction';
import S3Function from '../../common/S3Function';
import Log from '@dazn/lambda-powertools-logger';
import { DocumentRepository } from '../../services';

export default class DocumentIndexerFunction extends SNSFunction<S3Event> {

    private readonly s3Handler: S3Handler;

    constructor(documentRepository: DocumentRepository) {        
        super();
        this.s3Handler = new S3Handler(documentRepository);
    }

    async handleMessage(s3Event: S3Event): Promise<void> {
        await this.s3Handler.handle(s3Event, this.context);
    }
}

class S3Handler extends S3Function {

    constructor(private documentRepository: DocumentRepository) {
        super();
    }
    
    async handleEventRecord(eventRecord: S3EventRecord): Promise<void> {

        const index = 
            await this.documentRepository.getIndexByS3Details(
                eventRecord.s3.bucket.name, 
                eventRecord.s3.object.key
            );

        index.s3ETag = eventRecord.s3.object.eTag;

        await this.documentRepository.putIndex(index);

        Log.info('Put document index', {index});
    }
}