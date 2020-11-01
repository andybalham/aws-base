import { ApiGatewayLambda } from '../../common/ApiGatewayLambda';

import { Request, Response } from '.';
import { HttpStatusCode } from '../../common/HttpStatusCode';
import { ConfigurationRepositoryClient, CalculationEngine, ProductRepositoryClient } from '../../services';

export class AffordabilityApiLambda extends ApiGatewayLambda<Request, Response> {

    constructor(
        private configurationRepository: ConfigurationRepositoryClient,
        private productRepository: ProductRepositoryClient,
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<{statusCode: HttpStatusCode; content: Response}> {

        const configuration = 
            await this.configurationRepository.getConfiguration(request.stage);

        const calculationEngine = new CalculationEngine();

        const calculationResults =
            calculationEngine.evaluate(request.inputs, configuration);

        const product = await this.productRepository.getProduct(`PID-${request.stage}`);

        // TODO 01Nov20: Add product engine
        const maximumLoanAmount = calculationResults.applicableIncome * product.incomeMultiplier;

        const response: Response = {
            correlationId: this.correlationId,
            requestId: this.requestId,
            outputs: {
                productSummaries: [
                    { 
                        productIdentifier: product.productIdentifier,
                        productDescription: product.productDescription,
                        maximumLoanAmount: maximumLoanAmount
                    }
                ]
            }
        };

        return {statusCode: HttpStatusCode.OK, content: response};
    }
}