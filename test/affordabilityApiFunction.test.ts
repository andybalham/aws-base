import TypedAPIGatewayProxyEvent from '../src/common/TypedAPIGatewayProxyEvent';
import * as affordabilityApiFunction from '../src/functions/affordabilityApi/affordabilityApiFunction';

describe('Test lambda', () => {

    it('handles something', async () => {

        const request = {
            creditCardNumber: '012345678912',
            expiryMonth: 12,
            expiryYear: 2020,
            cvc: '123',
            nameOnCard: 'Gordon Meatpie',
            amount: 616.00
        };

        const response = await affordabilityApiFunction.handle(new TypedAPIGatewayProxyEvent(request));

        console.log(`request: ${JSON.stringify(request)}`);
        console.log(`request stringfied: ${JSON.stringify(JSON.stringify(request))}`);
        
        console.log(`response: ${JSON.stringify(response)}`);
    });
});