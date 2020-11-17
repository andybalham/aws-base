import { ApiGatewayLambda } from '../../common/ApiGatewayLambda';

import { Request, Response } from '.';
import { DocumentType, DocumentRepository, CalculationEngine } from '../../services';
import { ClientConfiguration } from '../../domain/configuration';

export class AffordabilityApiLambda extends ApiGatewayLambda<Request, Response> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<Response> {

        const clientConfiguration: ClientConfiguration = 
            await this.documentRepository.getObject('client', DocumentType.configuration);

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
            outputs: {
                productSummaries
            }
        };

        return response;
    }
}