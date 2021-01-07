import * as DocumentIndexer from '../../src/functions/documentIndexer/index';
import * as Common from '../../src/common';
import * as Services from '../../src/services';
import { S3Event } from 'aws-lambda/trigger/s3';
import { ImportMock, MockManager } from 'ts-mock-imports';
import { Document, DocumentType } from '../../src/domain/document';
import { expect } from 'chai';

describe('Test DocumentIndexerFunction', () => {
    
    let s3ClientMock: MockManager<Common.S3Client>;
    let documentRepositoryMock: MockManager<Services.DocumentRepository>;

    beforeEach('mock out dependencies', function () {
        s3ClientMock = ImportMock.mockClass<Common.S3Client>(Common, 'S3Client');
        documentRepositoryMock = ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('handles request', async () => {

        // Arrange

        const testDocument: Document = {
            metadata: {
                id: 'expectedId',
                type: DocumentType.Scenario,
                description: 'expectedDescription'
            },
            content: {}
        };

        const documentGetStub = s3ClientMock.mock('getJsonObject', testDocument);

        const documentRepositoryPutIndexStub = documentRepositoryMock.mock('putIndex');

        const sutDocumentIndexerFunction = 
            new DocumentIndexer.Function(
                new Common.S3Client(), 
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

        expect(documentGetStub.called).is.true;
        expect(documentGetStub.lastCall.args[0]).equals(s3Event.Records[0].s3.object.key);
        expect(documentGetStub.lastCall.args[1]).equals(s3Event.Records[0].s3.bucket.name);

        expect(documentRepositoryPutIndexStub.called).is.true;
        expect(documentRepositoryPutIndexStub.lastCall.args[0]).to.deep.equal(testDocument.metadata);
        expect(documentRepositoryPutIndexStub.lastCall.args[1]).to.equal(s3Event.Records[0].s3.bucket.name);
        expect(documentRepositoryPutIndexStub.lastCall.args[2]).to.deep
            .equal({
                key: s3Event.Records[0].s3.object.key,
                eTag: s3Event.Records[0].s3.object.eTag,
            });
    });
    
});