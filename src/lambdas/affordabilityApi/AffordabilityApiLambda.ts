import { ApiGatewayLambda } from '../../common/ApiGatewayLambda';
import { HttpStatusCode } from '../../common/HttpStatusCode';

import { Request, Response } from '.';
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

        const products = await this.productRepository.getProducts();

        const productSummaries = 
            products.map(product => {
                
                const maximumLoanAmount = 
                    calculationResults.applicableIncome * product.incomeMultiplier;

                return { 
                    productIdentifier: product.productIdentifier,
                    productDescription: product.productDescription,
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