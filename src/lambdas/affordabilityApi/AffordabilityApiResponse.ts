import { Outputs } from '../../domain/output';

export class AffordabilityApiResponse {

    correlationId: string;
    requestId: string;
    outputs: Outputs;

    static schema = {
        type: 'object',
        properties: {
            correlationId: {type: 'string'},
            requestId: {type: 'string'},
            outputs: Outputs.schema
        },
        required: ['correlationId', 'requestId', 'outputs']
    };
}