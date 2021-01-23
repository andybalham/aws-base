import { Request, Response } from '.';
import { DocumentRepository, ProductEngine } from '../../services';
import { ApiGatewayFunction } from '../../common';
import { Configuration } from '../../domain/configuration';
import { DocumentContentType } from '../../domain/document';

export default class AffordabilityApiFunction extends ApiGatewayFunction<Request, Response> {

    constructor(
        private documentRepository: DocumentRepository,
        private productEngine: ProductEngine,
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<Response> {

        const clientConfiguration = 
            await this.documentRepository.getContentAsync<Configuration>(
                DocumentContentType.Configuration, 'client'
            );

        const productSummaries = 
            this.productEngine.calculateProductSummaries(
                clientConfiguration, request.application, request.products);

        const response: Response = {
            outputs: {
                productSummaries
            }
        };

        return response;
    }
}