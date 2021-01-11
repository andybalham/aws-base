import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Services from '../../src/services';
import { Configuration } from '../../src/domain/configuration';
import * as AffordabilityApi from '../../src/functions/affordabilityApi';
import * as Common from '../../src/common';
import { Document, DocumentType, DocumentIndex } from '../../src/domain/document';
import { expect } from 'chai';

describe('Test AffordabilityApiFunction', () => {

    let s3ClientMock: MockManager<Common.S3Client>;
    let dynamodbClientMock: MockManager<Common.DynamoDBClient>;

    beforeEach('mock out dependencies', function () {
        s3ClientMock = ImportMock.mockClass<Common.S3Client>(Common, 'S3Client');
        dynamodbClientMock = ImportMock.mockClass<Common.DynamoDBClient>(Common, 'DynamoDBClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
      
    it('handles request', async () => {

        const testConfiguration: Configuration = {
            basicSalaryUsed: 1.0,
            overtimeUsed: 0.5,
        };

        const testConfigurationDocument: Document = {
            metadata: {
                id: 'id',
                type: DocumentType.Configuration
            },
            content: testConfiguration
        };

        const testConfigurationDocumentIndex: DocumentIndex = {
            id: 'C-documentId',
            documentId: 'documentId',
            documentType: DocumentType.Configuration,
            s3BucketName: 'bucketName',
            s3ETag: 'ETag',
            s3Key: 'key',
        };

        dynamodbClientMock.mock('get', testConfigurationDocumentIndex);
        s3ClientMock.mock('getJsonObject', testConfigurationDocument);

        const sutAffordabilityApiFunction = 
            new AffordabilityApi.Function(
                new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient()),
                new Services.ProductEngine()
            );

        const request: AffordabilityApi.Request = {
            application: {
                applicants: [
                    {
                        primaryEmployedAmounts: {
                            basicSalary: 30000,
                            overtime: 10000,
                        },
                    },
                ]
            },
            products: [
                {
                    productIdentifier: 'HIGH',
                    productDescription: 'High rate product',
                    interestRate: 6,
                    incomeMultiplier: 3.5,
                },
                {
                    productIdentifier: 'LOW',
                    productDescription: 'Low rate product',
                    interestRate: 3,
                    incomeMultiplier: 2,
                },
            ]
        };
    
        console.log(`request: ${JSON.stringify(request)}`);
    
        const response = await sutAffordabilityApiFunction.handleRequest(request);

        expect(response.outputs.productSummaries).to.have.length(2);
    });
});