import ParsedAPIGatewayProxyEvent from '../src/common/ParsedAPIGatewayProxyEvent';
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

        const response = await affordabilityApiFunction.handle(new ParsedAPIGatewayProxyEvent(request));

        console.log(`request: ${JSON.stringify(request)}`);
        
        console.log(`response: ${JSON.stringify(response)}`);
    });
});