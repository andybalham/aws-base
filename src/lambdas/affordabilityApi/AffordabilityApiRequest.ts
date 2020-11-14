import { Inputs } from '../../domain/input';
import { Product } from '../../domain/product';

export class AffordabilityApiRequest {

    inputs: Inputs;
    products: Product[];

    static schema = {
        type: 'object',
        properties: {
            inputs: Inputs.schema,
            products: { 
                type: 'array',
                items: Product.schema
            },
        },
        required: ['inputs', 'products']
    };
}

