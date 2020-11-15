import { Application } from '../../domain/input/Application';
import { Product } from '../../domain/product';

export class AffordabilityApiRequest {

    application: Application;
    products: Product[];

    // static schema = {
    //     type: 'object',
    //     properties: {
    //         inputs: Inputs.schema,
    //         products: { 
    //             type: 'array',
    //             items: Product.schema
    //         },
    //     },
    //     required: ['inputs', 'products']
    // };
}

