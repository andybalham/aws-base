import TypedAPIGatewayProxyEvent from '../src/common/TypedAPIGatewayProxyEvent';
import * as AffordabilityApi from '../src/functions/affordabilityApi/index';

describe('Test lambda', () => {

    it('handles something', async () => {

        const request: AffordabilityApi.Request = {
            creditCardNumber: '012345678912',
            expiryMonth: 12,
            expiryYear: 2020,
            cvc: '123',
            nameOnCard: 'Gordon Meatpie',
            amount: 616.00
        };

        const response = await AffordabilityApi.handle(new TypedAPIGatewayProxyEvent(request));

        console.log(`request: ${JSON.stringify(request)}`);
        
        console.log(`response: ${JSON.stringify(response)}`);
    });
});