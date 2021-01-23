import { TaskFunction } from '../../common';
import { Request } from '.';
import { DocumentRepository, ProductEngine } from '../../services';
import { DocumentContentType } from '../../domain/document';

export default class RecalculatorFunction extends TaskFunction<Request, void> {

    constructor(
        private documentRepository: DocumentRepository,
        private productEngine: ProductEngine,
    ) {
        super();        
    }

    async handleRequest(request: Request): Promise<void> {

        const configuration = await this.documentRepository.getConfigurationAsync(request.configurationId);
        const application = await this.documentRepository.getApplicationAsync(request.scenarioId);
        const product = await this.documentRepository.getProductAsync(request.productId);

        const productSummaries =
            this.productEngine.calculateProductSummaries(configuration, application, [product]);

        this.documentRepository
            .putContentAsync(
                {
                    id: `${request.configurationId}-${request.scenarioId}-${request.productId}`,
                    contentType: DocumentContentType.Result,
                    // TODO 13Jan21: We really need the description here
                    description: `Result for configuration ${request.configurationId}, scenario ${request.scenarioId}, product ${request.productId}`
                },
                productSummaries[0] // TODO 13Jan21: We should store a Scenario object here, with a description
            );
    }
}