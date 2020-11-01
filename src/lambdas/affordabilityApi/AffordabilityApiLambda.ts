import { ApiGatewayLambda } from '../../common/ApiGatewayLambda';

import { Request, Response } from '.';
import { HttpStatusCode } from '../../common/HttpStatusCode';
import { ConfigurationClient, CalculationEngineClient } from '../../services';

export class AffordabilityApiLambda extends ApiGatewayLambda<Request, Response> {

    constructor(
        private configurationClient: ConfigurationClient,
        private calculationEngineClient: CalculationEngineClient
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<{statusCode: HttpStatusCode; content: Response}> {

        const affordabilityInputs = request.inputs;

        if (affordabilityInputs.incomes.length === 0) {
            throw new Error('No incomes supplied!');
        }

        const configuration = 
            await this.configurationClient.getConfiguration(affordabilityInputs.stage);

        const calculationResults =
            this.calculationEngineClient.evaluate(request.inputs, configuration);

        const response: Response = {
            correlationId: this.correlationId,
            requestId: this.requestId,
            outputs: {
                productSummaries: [
                    { 
                        productIdentifier: 'PID',
                        productDescription: 'My Product',
                        maximumLoanAmount: calculationResults.maximumLoanAmount
                    }
                ]
            }
        };

        return {statusCode: HttpStatusCode.OK, content: response};
    }
}