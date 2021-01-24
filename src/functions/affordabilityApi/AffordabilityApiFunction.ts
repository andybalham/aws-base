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

        console.log('handleRequest 1');

        const clientConfiguration = 
            await this.documentRepository.getConfigurationAsync('client');

        console.log('handleRequest 2');

        const productSummaries = 
            this.productEngine.calculateProductSummaries(
                clientConfiguration, request.application, request.products);

        console.log('handleRequest 3');

        const response: Response = {
            outputs: {
                productSummaries
            }
        };

        return response;
    }
}