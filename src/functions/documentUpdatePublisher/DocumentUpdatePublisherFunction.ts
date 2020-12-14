import DynamoDBStreamFunction from '../../common/DynamoDBStreamFunction';
import DocumentIndex from '../../domain/documentIndex/DocumentIndex';

export default class DocumentUpdatePublisherFunction extends DynamoDBStreamFunction<DocumentIndex> {

    async processEventRecord(
        eventName: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined, 
        oldImage?: DocumentIndex, 
        newImage?: DocumentIndex,
    ): Promise<void> {

        const isDocumentUpdate = (newImage?.s3ETag !== oldImage?.s3ETag);

        if (isDocumentUpdate) {
            console.log(`TODO: Publish an update for ${JSON.stringify(newImage)}`);
        }
    }
}