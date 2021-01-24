import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Services from '../../src/services';
import { Configuration } from '../../src/domain/configuration';
import * as AffordabilityApi from '../../src/functions/affordabilityApi';
import { expect } from 'chai';

describe('Test AffordabilityApiFunction', () => {

    let documentRepositoryMock: MockManager<Services.DocumentRepository>;

    beforeEach('mock out dependencies', function () {
        documentRepositoryMock = 
            ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
      
    it('handles request', async () => {

        const testConfigurationContent: Configuration = {
            basicSalaryUsed: 1.0,
            overtimeUsed: 0.5,
        };

        documentRepositoryMock.mock('getConfigurationAsync', testConfigurationContent);

        const sutAffordabilityApiFunction = 
            new AffordabilityApi.Function(
                new Services.DocumentRepository(),
                new Services.ProductEngine(),
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