import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Services from '../src/services';
import { ClientConfiguration } from '../src/domain/configuration';
import * as AffordabilityApi from '../src/lambdas/affordabilityApi/index';

describe('Test lambda', () => {

    let documentRepositoryMock: MockManager<Services.DocumentRepository>;

    beforeEach('mock out dependencies', function () {
        documentRepositoryMock = 
            ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
      
    it('handles something', async () => {

        const testClientConfiguration: ClientConfiguration = {
            basicSalaryUsed: 1.0,
            overtimeUsed: 0.5,
        };

        documentRepositoryMock.mock('getContent', testClientConfiguration);

        const sutLambda = 
            new AffordabilityApi.Lambda(
                new Services.DocumentRepository(),
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
                    {
                        primaryEmployedAmounts: {
                            basicSalary: 20000,
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
    
        const response = await sutLambda.handleRequest(request);

        // TODO 01Nov20: Think about what we should really be asserting here
        console.log(`response: ${JSON.stringify(response)}`);
    });
});