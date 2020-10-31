import { ApiGatewayLambda } from '../../common/ApiGatewayLambda';

import { Request, Response } from '.';
import { HttpStatusCode } from '../../common/HttpStatusCode';
import { ConfigurationClient } from '../../domain/configuration';

export class AffordabilityApiLambda extends ApiGatewayLambda<Request, Response> {

    constructor(public configurationClient: ConfigurationClient) {
        super();
    }

    async handleRequest(request: Request): Promise<{statusCode: HttpStatusCode; content: Response}> {

        const affordabilityInputs = request.inputs;

        if (affordabilityInputs.incomes.length === 0) {
            throw new Error('No incomes supplied!');
        }

        const configuration = 
            this.configurationClient.getConfiguration(affordabilityInputs.stage);

        console.log(`configuration: ${JSON.stringify(configuration)}`);

        const maximumLoanAmount =
            affordabilityInputs.incomes
                .map(income => income.annualAmount)
                .reduce((total, annualAmount) => total + annualAmount, 0)
                * 3.5;

        const response: Response = {
            correlationId: this.correlationId,
            requestId: this.requestId,
            outputs: {
                productSummaries: [
                    { 
                        productIdentifier: 'PID',
                        productDescription: 'My Product',
                        maximumLoanAmount: maximumLoanAmount
                    }
                ]
            }
        };

        return {statusCode: HttpStatusCode.OK, content: response};
    }
}