import * as DocumentIndexer from '../../src/functions/documentIndexer/index';
import * as Services from '../../src/services';
import { S3Event } from 'aws-lambda/trigger/s3';
import { ImportMock, MockManager } from 'ts-mock-imports';
import { expect } from 'chai';
import { DocumentHash } from '../../src/domain/document';

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

        const sutDocumentIndexerFunction = 
            new DocumentIndexer.Function(
                new Services.DocumentRepository(),
            );

        const putHashAsyncStub = documentRepositoryMock.mock('putHashAsync');

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

        const expectedHash: DocumentHash = {
            s3BucketName: s3Event.Records[0].s3.bucket.name,
            s3Key: s3Event.Records[0].s3.object.key,
            hash: s3Event.Records[0].s3.object.eTag,
        };

        expect(putHashAsyncStub.called).is.true;
        expect(putHashAsyncStub.lastCall.args[0]).to.deep.equal(expectedHash);
    });
});