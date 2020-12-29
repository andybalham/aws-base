import { Request, Response } from '.';
import { DocumentRepository, ProductEngine } from '../../services';
import { ClientConfiguration } from '../../domain/configuration';
import { DocumentType } from '../../domain/document';
import { ApiGatewayFunction } from '../../common';

export default class AffordabilityApiFunction extends ApiGatewayFunction<Request, Response> {

    constructor(
        private documentRepository: DocumentRepository,
        private productEngine: ProductEngine,
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<Response> {

        const clientConfiguration: ClientConfiguration = 
            await this.documentRepository.getContent('client', DocumentType.Configuration);

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