import { ApiGatewayLambda } from '../../common/ApiGatewayLambda';
import { HttpStatusCode } from '../../common/HttpStatusCode';

import { Request, Response } from '.';
import { ConfigurationRepositoryClient, CalculationEngine } from '../../services';

export class AffordabilityApiLambda extends ApiGatewayLambda<Request, Response> {

    constructor(
        private configurationRepository: ConfigurationRepositoryClient,
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<{statusCode: HttpStatusCode; content: Response}> {

        const configuration = 
            await this.configurationRepository.getConfiguration();

        const calculationEngine = new CalculationEngine();

        const calculationResults =
            calculationEngine.evaluate(request.inputs, configuration);

        const productSummaries = 
            request.products.map(product => {
                
                const maximumLoanAmount = 
                    calculationResults.applicableIncome * product.incomeMultiplier;

                return { 
                    product,
                    maximumLoanAmount: maximumLoanAmount
                };
            });

        const response: Response = {
            correlationId: this.correlationId,
            requestId: this.requestId,
            outputs: {
                productSummaries: productSummaries
            }
        };

        return {statusCode: HttpStatusCode.OK, content: response};
    }
}