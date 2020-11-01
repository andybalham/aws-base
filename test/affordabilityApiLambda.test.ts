import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Services from '../src/services';
import { Configuration } from '../src/domain/configuration';
import { IncomeType } from '../src/domain/input';
import * as AffordabilityApi from '../src/lambdas/affordabilityApi/index';
import { CalculationResults } from '../src/domain/calculation';

describe('Test lambda', () => {

    let configurationClientMock: MockManager<Services.ConfigurationClient>;
    let calculationEngineClientMock: MockManager<Services.CalculationEngineClient>;

    beforeEach('mock out dependencies', function () {
        configurationClientMock = ImportMock.mockClass<Services.ConfigurationClient>(Services, 'ConfigurationClient');
        calculationEngineClientMock = ImportMock.mockClass<Services.CalculationEngineClient>(Services, 'CalculationEngineClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
      
    it('handles something', async () => {

        console.log(`AffordabilityApi.Request.schema: ${JSON.stringify(AffordabilityApi.Request.schema)}`);

        const request: AffordabilityApi.Request = {
            inputs: {
                stage: 'PROD',
                incomes: [
                    { incomeType: IncomeType.Primary, annualAmount: 616.00 }
                ]
            }
        };

        console.log(`request: ${JSON.stringify(JSON.stringify(request))}`);

        configurationClientMock.mock('getConfiguration', new Configuration('MOCK'));
        calculationEngineClientMock.mock('evaluate', new CalculationResults(616));

        const sutLambda = 
            new AffordabilityApi.Lambda(
                new Services.ConfigurationClient(), new Services.CalculationEngineClient());

        const response = await sutLambda.handleRequest(request);

        console.log(`response: ${JSON.stringify(response)}`);
    });
});