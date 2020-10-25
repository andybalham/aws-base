export class AffordabilityApiRequest {
    creditCardNumber: string
    expiryMonth: number
    expiryYear: number
    cvc: string
    nameOnCard: string
    amount: number
}

export const requestSchema = {
    type: 'object',
    properties: {
        creditCardNumber: { type: 'string', minLength: 12, maxLength: 19, pattern: '\\d+' },
        expiryMonth: { type: 'integer', minimum: 1, maximum: 12 },
        expiryYear: { type: 'integer', minimum: 2017, maximum: 2027 },
        cvc: { type: 'string', minLength: 3, maxLength: 4, pattern: '\\d+' },
        nameOnCard: { type: 'string' },
        amount: { type: 'number' }
    },
    required: ['creditCardNumber'] // Insert here all required event properties
};
