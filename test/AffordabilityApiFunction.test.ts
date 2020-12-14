import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Services from '../src/services';
import { ClientConfiguration } from '../src/domain/configuration';
import * as AffordabilityApi from '../src/functions/affordabilityApi/index';
import * as Common from '../src/common';
import { Document, DocumentType } from '../src/services/DocumentRepository';
import { expect } from 'chai';

describe('Test AffordabilityApiFunction', () => {

    let s3ClientMock: MockManager<Common.S3Client>;

    beforeEach('mock out dependencies', function () {
        s3ClientMock = ImportMock.mockClass<Common.S3Client>(Common, 'S3Client');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
      
    it('handles request', async () => {

        const testClientConfiguration: ClientConfiguration = {
            basicSalaryUsed: 1.0,
            overtimeUsed: 0.5,
        };

        const testClientConfigurationDocument: Document = {
            metadata: {
                id: 'id',
                type: DocumentType.configuration
            },
            content: testClientConfiguration
        };

        s3ClientMock.mock('getJsonObject', testClientConfigurationDocument);

        const sutAffordabilityApiFunction = 
            new AffordabilityApi.Function(
                new Services.DocumentRepository(new Common.S3Client()),
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