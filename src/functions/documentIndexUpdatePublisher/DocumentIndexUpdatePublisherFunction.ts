import { SNSClient } from '@andybalham/agb-aws-clients';
import { DynamoDBStreamFunction, DynamoDBEventTypes } from '@andybalham/agb-aws-functions';
import { DynamoDBStreamFunctionProps } from '@andybalham/agb-aws-functions/DynamoDBStreamFunction';
import { DynamoDBSingleTableItem } from '../../common';
import { DocumentHash } from '../../domain/document';
import { DocumentRepository } from '../../services';

export default class DocumentIndexUpdatePublisherFunction extends DynamoDBStreamFunction<DynamoDBSingleTableItem> {
  //
  constructor(
    private documentRepository: DocumentRepository,
    private documentUpdateTopic: SNSClient,
    props?: DynamoDBStreamFunctionProps
  ) {
    super(props);
  }

  async processEventRecordAsync(
    eventType: DynamoDBEventTypes,
    oldImage?: DynamoDBSingleTableItem,
    newImage?: DynamoDBSingleTableItem
  ): Promise<void> {
    //
    if (newImage?.ITEM_TYPE === 'hash') {
      //
      const oldHash = oldImage && DynamoDBSingleTableItem.getEntity<DocumentHash>(oldImage);
      const newHash = newImage && DynamoDBSingleTableItem.getEntity<DocumentHash>(newImage);

      const isHashUpdate =
        eventType === 'INSERT' || (eventType === 'MODIFY' && newHash?.hash !== oldHash?.hash);

      if (isHashUpdate && newImage) {
        //
        const index = await this.documentRepository.getIndexByS3Async(
          newHash.s3BucketName,
          newHash.s3Key
        );

        if (index === undefined) throw new Error('index === undefined');

        await this.documentUpdateTopic.publishMessageAsync(index, {
          contentType: index.contentType,
        });
      }
    }
  }
}
