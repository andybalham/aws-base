import HttpValidatorOptions from '../src/common/HttpValidatorOptions';

describe('Investigations', () => {

    it('Test HttpValidatorOptions', async () => {

        const requestSchema = {
            type: 'object',
            properties: {
                // eslint-disable-next-line no-useless-escape
                creditCardNumber: { type: 'string', minLength: 12, maxLength: 19, pattern: '\d+' },
                expiryMonth: { type: 'integer', minimum: 1, maximum: 12 },
                expiryYear: { type: 'integer', minimum: 2017, maximum: 2027 },
                // eslint-disable-next-line no-useless-escape
                cvc: { type: 'string', minLength: 3, maxLength: 4, pattern: '\d+' },
                nameOnCard: { type: 'string' },
                amount: { type: 'number' }
            },
            required: ['creditCardNumber'] // Insert here all required event properties
        };

        const httpValidatorOptions = new HttpValidatorOptions(requestSchema);

        console.log(`httpValidatorOptions: ${JSON.stringify(httpValidatorOptions)}`);
    });
});
