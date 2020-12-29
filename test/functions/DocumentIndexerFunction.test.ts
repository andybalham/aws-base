import * as DocumentIndexer from '../../src/functions/documentIndexer/index';
import * as Common from '../../src/common';
import { S3Event } from 'aws-lambda/trigger/s3';
import { ImportMock, MockManager } from 'ts-mock-imports';
import { Document, DocumentType } from '../../src/domain/document';
import { expect } from 'chai';
import { SinonStub } from 'sinon';
import { DocumentIndex } from '../../src/domain/document';

describe('Test AffordabilityApiFunction', () => {
    
    let s3ClientMock: MockManager<Common.S3Client>;
    let dynamoDBClientMock: MockManager<Common.DynamoDBClient>;

    beforeEach('mock out dependencies', function () {
        s3ClientMock = ImportMock.mockClass<Common.S3Client>(Common, 'S3Client');
        dynamoDBClientMock = ImportMock.mockClass<Common.DynamoDBClient>(Common, 'DynamoDBClient');
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

        const documentIndexPutStub: SinonStub = dynamoDBClientMock.mock('put');

        const sutDocumentIndexerFunction = 
            new DocumentIndexer.Function(new Common.S3Client(), new Common.DynamoDBClient());

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

        expect(documentIndexPutStub.called).is.true;
        const expectedDocumentIndex: DocumentIndex = {
            documentId: testDocument.metadata.id,
            documentType: testDocument.metadata.type,
            s3BucketName: s3Event.Records[0].s3.bucket.name,
            s3Key: s3Event.Records[0].s3.object.key,
            s3ETag: s3Event.Records[0].s3.object.eTag,
            description: testDocument.metadata.description,
        };
        expect(documentIndexPutStub.lastCall.args[0]).to.deep.equal(expectedDocumentIndex);
    });
    
});