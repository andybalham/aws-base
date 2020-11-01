import { Inputs } from '../../domain/input';

export class AffordabilityApiRequest {

    static schema = {
        type: 'object',
        properties: {
            stage: {type: 'string'},
            inputs: Inputs.schema
        },
        required: ['stage', 'inputs']
    };

    stage: string;
    inputs: Inputs;
}

