import Log from '@dazn/lambda-powertools-logger';
import DynamoDBStreamFunction from '../../common/DynamoDBStreamFunction';
import SNSClient from '../../common/SNSClient';
import DocumentIndex from '../../domain/documentIndex/DocumentIndex';

export default class DocumentUpdatePublisherFunction extends DynamoDBStreamFunction<DocumentIndex> {

    constructor(private documentUpdateTopic: SNSClient) {
        super();
    }

    async processEventRecord(
        eventName: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined, 
        oldImage?: DocumentIndex, 
        newImage?: DocumentIndex,
    ): Promise<void> {

        const isDocumentUpdate = 
            (eventName === 'INSERT')
            || ((eventName === 'MODIFY') && (newImage?.s3ETag !== oldImage?.s3ETag));

        if (isDocumentUpdate && newImage) {
            const response = 
                await this.documentUpdateTopic.publishMessage(newImage, { documentType: newImage.documentType });
            Log.debug('Published document update message', {response});
        }
    }
}