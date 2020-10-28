export class ProductSummary {

    static schema = {
        type: 'object',
        properties: {
            productIdentifier: { type: 'string' },
            productDescription: { type: 'string' },
            maximumLoanAmount: { type: 'number'},
        },
        required: ['productIdentifier', 'productDescription', 'maximumLoanAmount']
    };
    
    productIdentifier: string;
    productDescription: string;
    maximumLoanAmount: number;
}