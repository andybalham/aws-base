import DynamoDBStreamFunction, { DynamoDBEventTypes } from '../../common/DynamoDBStreamFunction';
import SNSClient from '../../common/SNSClient';
import { DocumentIndex } from '../../domain/document';

export default class DocumentIndexUpdatePublisherFunction extends DynamoDBStreamFunction<DocumentIndex> {

    constructor(private documentUpdateTopic: SNSClient) {
        super();
    }

    async processEventRecord(
        eventType: DynamoDBEventTypes,
        oldImage?: DocumentIndex, 
        newImage?: DocumentIndex,
    ): Promise<void> {

        const isDocumentUpdate = 
            (eventType === 'INSERT')
            || ((eventType === 'MODIFY') && (newImage?.s3ETag !== oldImage?.s3ETag));

        if (isDocumentUpdate && newImage) {            
            await this.documentUpdateTopic.publishMessage(newImage, { documentType: newImage.documentType });
        }
    }
}