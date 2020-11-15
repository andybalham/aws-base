import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Services from '../src/services';
import { ClientConfiguration } from '../src/domain/configuration';
import * as AffordabilityApi from '../src/lambdas/affordabilityApi/index';

describe('Test lambda', () => {

    let configurationRepositoryMock: MockManager<Services.ConfigurationRepositoryClient>;

    beforeEach('mock out dependencies', function () {
        configurationRepositoryMock = 
            ImportMock.mockClass<Services.ConfigurationRepositoryClient>(Services, 'ConfigurationRepositoryClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
      
    it('handles something', async () => {

        const testConfiguration: ClientConfiguration = {
            basicSalaryUsed: 1.0,
            overtimeUsed: 0.5,
        };

        configurationRepositoryMock.mock('getClientConfiguration', testConfiguration);

        const sutLambda = 
            new AffordabilityApi.Lambda(
                new Services.ConfigurationRepositoryClient(),
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