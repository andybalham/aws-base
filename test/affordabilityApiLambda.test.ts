import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Services from '../src/services';
import { Configuration } from '../src/domain/configuration';
import { IncomeType } from '../src/domain/input';
import * as AffordabilityApi from '../src/lambdas/affordabilityApi/index';
import { Product } from '../src/domain/product';

describe('Test lambda', () => {

    let configurationRepositoryMock: MockManager<Services.ConfigurationRepositoryClient>;
    let productRepositoryMock: MockManager<Services.ProductRepositoryClient>;

    beforeEach('mock out dependencies', function () {
        configurationRepositoryMock = 
            ImportMock.mockClass<Services.ConfigurationRepositoryClient>(Services, 'ConfigurationRepositoryClient');
        productRepositoryMock = 
            ImportMock.mockClass<Services.ProductRepositoryClient>(Services, 'ProductRepositoryClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
      
    it('handles something', async () => {

        const testConfiguration = 
            new Configuration(new Map([
                [IncomeType.Primary, 100],
                [IncomeType.Other, 50],
            ]));

        configurationRepositoryMock.mock('getConfiguration', testConfiguration);

        const testProduct = new Product('TEST', 'Test description', 2);

        productRepositoryMock.mock('getProduct', testProduct);

        const sutLambda = 
            new AffordabilityApi.Lambda(
                new Services.ConfigurationRepositoryClient(),
                new Services.ProductRepositoryClient()
            );

        const request: AffordabilityApi.Request = {
            stage: 'PROD',
            inputs: {
                incomes: [
                    { incomeType: IncomeType.Primary, annualAmount: 61600.00 }
                ]
            }
        };
    
        console.log(`request: ${JSON.stringify(JSON.stringify(request))}`);
    
        const response = await sutLambda.handleRequest(request);

        // TODO 01Nov20: Think about what we should really be asserting here
        console.log(`response: ${JSON.stringify(response)}`);
    });
});