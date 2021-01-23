import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Services from '../../src/services';
import { Configuration } from '../../src/domain/configuration';
import * as AffordabilityApi from '../../src/functions/affordabilityApi';
import * as Common from '../../src/common';
import { DocumentContentType, DocumentIndex } from '../../src/domain/document';
import { expect } from 'chai';

describe('Test AffordabilityApiFunction', () => {

    let s3ClientMock: MockManager<Common.S3Client>;
    let dynamoDBSingleTableClientMock: MockManager<Common.DynamoDBSingleTableClient>;

    beforeEach('mock out dependencies', function () {
        s3ClientMock = ImportMock.mockClass<Common.S3Client>(Common, 'S3Client');
        dynamoDBSingleTableClientMock = 
            ImportMock.mockClass<Common.DynamoDBSingleTableClient>(Common, 'DynamoDBSingleTableClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
      
    it('handles request', async () => {

        const testConfigurationIndex: DocumentIndex = {
            id: 'id',
            contentType: DocumentContentType.Configuration,
            s3BucketName: 'bucketName',
            s3Key: 'key',
        };

        const testConfigurationContent: Configuration = {
            basicSalaryUsed: 1.0,
            overtimeUsed: 0.5,
        };

        dynamoDBSingleTableClientMock.mock('getAsync', testConfigurationIndex);
        s3ClientMock.mock('getObjectAsync', testConfigurationContent);

        const sutAffordabilityApiFunction = 
            new AffordabilityApi.Function(
                new Services.DocumentRepository(
                    new Common.S3Client(), 
                    new Common.DynamoDBSingleTableClient('TableName')
                ),
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