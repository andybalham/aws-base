import { Inputs } from '../../domain/input';

export class AffordabilityApiRequest {

    static schema = {
        type: 'object',
        properties: {
            inputs: Inputs.schema
        },
        required: ['inputs']
    };

    inputs: Inputs;
}

