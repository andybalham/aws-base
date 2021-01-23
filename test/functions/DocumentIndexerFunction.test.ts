import * as DocumentIndexer from '../../src/functions/documentIndexer/index';
import * as Common from '../../src/common';
import * as Services from '../../src/services';
import { S3Event } from 'aws-lambda/trigger/s3';
import { ImportMock, MockManager } from 'ts-mock-imports';
import { expect } from 'chai';
import { DocumentContentIndex, DocumentContentType } from '../../src/domain/document';

describe('Test DocumentIndexerFunction', () => {
    
    let documentRepositoryMock: MockManager<Services.DocumentRepository>;

    beforeEach('mock out dependencies', function () {
        documentRepositoryMock = ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('handles request', async () => {

        // Arrange

        const documentRepositoryPutIndexStub = documentRepositoryMock.mock('putIndex');

        const index: DocumentContentIndex = {
            id: 'id',
            contentType: DocumentContentType.Configuration,
            description: 'description',
            s3BucketName: 's3BucketName',
            s3Key: 's3Key',
        };

        documentRepositoryMock.mock('getIndexByS3Details', index);

        const sutDocumentIndexerFunction = 
            new DocumentIndexer.Function(
                new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient())
            );

        // Act

        const s3Event = {
            Records: [
                {
                    s3: { object: { key: 'objectKey', eTag: 'eTag' }, bucket: { name: 'bucketName' }}
                }
            ]
        };

        await sutDocumentIndexerFunction.handleMessage(s3Event as unknown as S3Event);

        // Assert

        const expectedIndex: DocumentContentIndex = {
            ...index,
            s3ETag: s3Event.Records[0].s3.object.eTag,
        };

        expect(documentRepositoryPutIndexStub.called).is.true;
        expect(documentRepositoryPutIndexStub.lastCall.args[0]).to.deep.equal(expectedIndex);
    });
});