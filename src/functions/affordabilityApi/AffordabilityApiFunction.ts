import { Request, Response } from '.';
import { DocumentRepository, CalculationEngine } from '../../services';
import { ClientConfiguration } from '../../domain/configuration';
import { DocumentType } from '../../domain/document';
import { ApiGatewayFunction } from '../../common';

export default class AffordabilityApiFunction extends ApiGatewayFunction<Request, Response> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<Response> {

        const clientConfiguration: ClientConfiguration = 
            await this.documentRepository.getContent('client', DocumentType.Configuration);

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