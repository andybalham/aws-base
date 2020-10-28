import { Outputs } from '../../domain/output';

export class AffordabilityApiResponse {

    static schema = {
        type: 'object',
        properties: {
            outputs: Outputs.schema
        },
        required: ['outputs']
    };

    outputs: Outputs;
}