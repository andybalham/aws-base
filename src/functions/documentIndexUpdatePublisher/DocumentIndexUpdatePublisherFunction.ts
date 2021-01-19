import DynamoDBStreamFunction, { DynamoDBEventTypes } from '../../common/DynamoDBStreamFunction';
import SNSClient from '../../common/SNSClient';
import { DocumentContentIndex } from '../../domain/document';

export default class DocumentIndexUpdatePublisherFunction extends DynamoDBStreamFunction<DocumentContentIndex> {

    constructor(private documentUpdateTopic: SNSClient) {
        super();
    }

    async processEventRecord(
        eventType: DynamoDBEventTypes,
        oldImage?: DocumentContentIndex, 
        newImage?: DocumentContentIndex,
    ): Promise<void> {
        
        const isContentUpdate = 
            (eventType === 'INSERT')
            || ((eventType === 'MODIFY') && (newImage?.s3ETag !== oldImage?.s3ETag));

        if (isContentUpdate && newImage) {            
            await this.documentUpdateTopic.publishMessage(newImage, { contentType: newImage.contentType });
        }
    }
}