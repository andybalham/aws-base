import { AffordabilityInput } from '../../domain';

export class AffordabilityApiRequest {

    static schema = {
        type: 'object',
        properties: {
            input: AffordabilityInput.schema
        },
        required: ['input']
    };

    input: AffordabilityInput;
}

