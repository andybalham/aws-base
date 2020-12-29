import { Product } from '.';

export default class ProductSummary {
    
    product: Product;
    maximumLoanAmount: number;

    static schema = {
        type: 'object',
        properties: {
            product: Product.schema,
            maximumLoanAmount: { type: 'number'},
        },
        required: ['product', 'maximumLoanAmount']
    };
}