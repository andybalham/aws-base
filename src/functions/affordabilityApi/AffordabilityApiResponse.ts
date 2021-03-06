import { Outputs } from '../../domain/output';

export default class AffordabilityApiResponse {
  outputs: Outputs;

  static schema = {
    type: 'object',
    properties: {
      outputs: Outputs.schema,
    },
    required: ['outputs'],
  };
}
