import { DocumentContentType } from '../src/domain/document';
import { DynamoDBSingleTableItem } from '../src/common';

describe('Investigations', () => {

    it('DynamoDBItem', async () => {

        const documentIndexItem = DynamoDBSingleTableItem.getItem('index', 'contentType', 'id', {
            contentType: DocumentContentType.Configuration,
            id: 'myId',
            s3BucketName: 'myS3BucketName',
            s3Key: 'myS3Key',
            obj: { my: 'object' }
        });

        const itemJson = JSON.stringify(documentIndexItem);

        console.log(`documentIndexItem: ${itemJson}`);

        const newItem: DynamoDBSingleTableItem = JSON.parse(itemJson);

        const entity = DynamoDBSingleTableItem.getEntity(newItem);

        console.log(`entity: ${JSON.stringify(entity)}`);
    });
    
});
