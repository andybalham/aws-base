import { ImportMock, MockManager } from 'ts-mock-imports';
import * as configurationModule from '../src/domain/configuration';
import { Configuration } from '../src/domain/configuration';
import { IncomeType } from '../src/domain/input';
import * as AffordabilityApi from '../src/functions/affordabilityApi/index';

describe('Test lambda', () => {

    let configurationClientMock: MockManager<configurationModule.ConfigurationClient>;
    let configurationClient = new configurationModule.ConfigurationClient();

    beforeEach('mock out dependencies', function () {
        configurationClientMock = ImportMock.mockClass(configurationModule, 'ConfigurationClient');
        configurationClient = new configurationModule.ConfigurationClient();
    });
    
    afterEach('restore dependencies', function () {
        configurationClientMock.restore();
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

        configurationClientMock.mock('getConfiguration', new Configuration());

        const sutLambda = new AffordabilityApi.Lambda(configurationClient);

        const response = await sutLambda.handleRequest(request);

        console.log(`response: ${JSON.stringify(response)}`);
    });
});