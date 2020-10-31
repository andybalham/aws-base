import { Outputs } from '../../domain/output';

export class AffordabilityApiResponse {

    static schema = {
        type: 'object',
        properties: {
            correlationId: {type: 'string'},
            requestId: {type: 'string'},
            outputs: Outputs.schema
        },
        required: ['correlationId', 'requestId', 'outputs']
    };

    correlationId: string;
    requestId: string;
    outputs: Outputs;
}