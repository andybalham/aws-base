import { Request, Response } from '.';
import { DocumentRepository, ProductEngine } from '../../services';
import { ApiGatewayFunction } from '../../common';

export default class AffordabilityApiFunction extends ApiGatewayFunction<Request, Response> {

    constructor(
        private documentRepository: DocumentRepository,
        private productEngine: ProductEngine,
    ) {
        super();
    }

    async handleRequestAsync(request: Request): Promise<Response> {

        const clientConfiguration = 
            await this.documentRepository.getConfigurationAsync('client');

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