import { S3Event, S3EventRecord } from 'aws-lambda/trigger/s3';
import SNSFunction from '../../common/SNSFunction';
import S3Function from '../../common/S3Function';
import Log from '@dazn/lambda-powertools-logger';
import { DocumentRepository } from '../../services';
import { DocumentHash } from '../../domain/document';

export default class DocumentIndexerFunction extends SNSFunction<S3Event> {

    private readonly s3Handler: S3Handler;

    constructor(documentRepository: DocumentRepository) {        
        super();
        this.s3Handler = new S3Handler(documentRepository);
    }

    async handleMessageAsync(s3Event: S3Event): Promise<void> {
        await this.s3Handler.handleAsync(s3Event, this.context);
    }
}

class S3Handler extends S3Function {

    constructor(private documentRepository: DocumentRepository) {
        super();
    }
    
    async handleEventRecordAsync(eventRecord: S3EventRecord): Promise<void> {

        const hash: DocumentHash = {
            s3BucketName: eventRecord.s3.bucket.name, 
            s3Key: eventRecord.s3.object.key,
            hash: eventRecord.s3.object.eTag
        };

        await this.documentRepository.putHashAsync(hash);

        Log.debug('Put document hash', {hash});
    }
}