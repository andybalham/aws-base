import { ProductSummary } from './ProductSummary';

export class Outputs {

    static schema = {
        type: 'object',
        properties: {
            productSummaries: { 
                type: 'array',
                items: ProductSummary.schema
            },
        },
        required: ['productSummaries']
    };

    productSummaries: ProductSummary[];
}