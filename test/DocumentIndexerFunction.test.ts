import * as DocumentIndexer from '../src/functions/documentIndexer/index';
import * as Common from '../src/common';
import { S3Event } from 'aws-lambda/trigger/s3';
import { ImportMock, MockManager } from 'ts-mock-imports';
import { Document, DocumentType } from '../src/services/DocumentRepository';

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
        
        const s3Event = {
            Records: [
                {
                    s3: { object: { key: 'objectKey' }, bucket: { name: 'bucketName', eTag: 'eTag' }}
                }
            ]
        };

        const testDocument: Document = {
            metadata: {
                id: 'expectedId',
                type: DocumentType.scenario,
                description: 'expectedDescription'
            },
            content: {}
        };

        s3ClientMock.mock('getJsonObject', testDocument);

        // TODO 07Dec20: Mock the DynamoDB client and add expectations
        
        const sutDocumentIndexerFunction = 
            new DocumentIndexer.Function(new Common.S3Client(), new Common.DynamoDBClient());

        sutDocumentIndexerFunction.handleMessage(s3Event as unknown as S3Event);
    });
    
});