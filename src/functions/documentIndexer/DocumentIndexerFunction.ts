import { S3Event, S3EventRecord } from 'aws-lambda/trigger/s3';
import SNSFunction from '../../common/SNSFunction';
import S3Function from '../../common/S3Function';
import S3Client from '../../common/S3Client';
import { Document } from '../../domain/document';
import Log from '@dazn/lambda-powertools-logger';
import { DocumentRepository } from '../../services';

export default class DocumentIndexerFunction extends SNSFunction<S3Event> {

    private readonly s3Handler: S3Handler;

    constructor(s3Client: S3Client, documentRepository: DocumentRepository) {        
        super();
        this.s3Handler = new S3Handler(s3Client, documentRepository);
    }

    async handleMessage(s3Event: S3Event): Promise<void> {
        await this.s3Handler.handle(s3Event, this.context);
    }
}

class S3Handler extends S3Function {

    constructor(private s3Client: S3Client, private documentRepository: DocumentRepository) {
        super();
    }
    
    async handleEventRecord(eventRecord: S3EventRecord): Promise<void> {

        const document: Document = 
            await this.s3Client.getJsonObject(eventRecord.s3.object.key, eventRecord.s3.bucket.name);

        const s3Details = eventRecord.s3;

        const newDocumentIndex = 
            await this.documentRepository.putIndex(document.metadata, s3Details.bucket.name, s3Details.object);

        Log.info('Put document index', {newDocumentIndex});
    }
}