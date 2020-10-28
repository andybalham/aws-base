import TypedAPIGatewayProxyEvent from '../src/common/TypedAPIGatewayProxyEvent';
import { IncomeType } from '../src/domain/input';
import * as AffordabilityApi from '../src/functions/affordabilityApi/index';

describe('Test lambda', () => {

    it('handles something', async () => {

        console.log(`AffordabilityApi.Request.schema: ${JSON.stringify(AffordabilityApi.Request.schema)}`);

        const request: AffordabilityApi.Request = {
            inputs: {
                incomes: [
                    { incomeType: IncomeType.Primary, annualAmount: 616.00 }
                ]
            }
        };

        const response = await AffordabilityApi.handle(new TypedAPIGatewayProxyEvent(request));

        console.log(`request: ${JSON.stringify(request)}`);
        
        console.log(`response: ${JSON.stringify(response)}`);
    });
});