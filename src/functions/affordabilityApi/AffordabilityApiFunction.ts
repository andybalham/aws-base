import { Request, Response } from '.';
import { DocumentRepository, ProductEngine } from '../../services';
import { ApiGatewayFunction } from '../../common';
import { Configuration } from '../../domain/configuration';

export default class AffordabilityApiFunction extends ApiGatewayFunction<Request, Response> {

    constructor(
        private documentRepository: DocumentRepository,
        private productEngine: ProductEngine,
    ) {
        super();
    }

    async handleRequest(request: Request): Promise<Response> {

        const clientConfiguration = await this.documentRepository.get<Configuration>('client');

        const productSummaries = 
            this.productEngine.calculateProductSummaries(
                clientConfiguration.content, request.application, request.products);

        const response: Response = {
            outputs: {
                productSummaries
            }
        };

        return response;
    }
}