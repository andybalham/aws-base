import { ApiGatewayLambda, ApiGatewayLambdaResponse } from '../../common/ApiGatewayLambda';
import { HttpStatusCode } from '../../common/HttpStatusCode';

import { Request, Response } from '.';
import { DocumentType, DocumentRepository, CalculationEngine } from '../../services';
import { ClientConfiguration } from '../../domain/configuration';

export class AffordabilityApiLambda extends ApiGatewayLambda<Request, Response> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<ApiGatewayLambdaResponse<Response>> {

        const clientConfiguration = 
            await this.documentRepository.get<ClientConfiguration>('client', DocumentType.configuration);

        const calculationEngine = new CalculationEngine();

        const calculationResults =
            calculationEngine.evaluate(request.application, clientConfiguration);

        const productSummaries = 
            request.products.map(product => {
                
                const maximumLoanAmount = 
                    calculationResults.applicableIncome * product.incomeMultiplier;

                return { 
                    product,
                    maximumLoanAmount
                };
            });

        const response: Response = {
            correlationId: this.correlationId,
            requestId: this.requestId,
            outputs: {
                productSummaries
            }
        };

        return {statusCode: HttpStatusCode.OK, content: response};
    }
}