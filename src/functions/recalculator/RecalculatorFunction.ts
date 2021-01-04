import { TaskFunction } from '../../common';
import { Request } from '.';
import { DocumentRepository, ProductEngine } from '../../services';
import { DocumentType } from '../../domain/document';

export default class RecalculatorFunction extends TaskFunction<Request, void> {

    constructor(
        private documentRepository: DocumentRepository,
        private productEngine: ProductEngine,
    ) {
        super();        
    }

    async handleRequest(request: Request): Promise<void> {

        const configuration = await this.documentRepository.getConfiguration(request.configurationId);
        const application = await this.documentRepository.getScenario(request.scenarioId);
        const product = await this.documentRepository.getProduct(request.productId);

        const productSummaries =
            this.productEngine.calculateProductSummaries(configuration, application, [product]);

        this.documentRepository
            .putContent(
                {
                    type: DocumentType.Result,
                    id: `${request.configurationId}-${request.scenarioId}-${request.productId}`,
                    description: `Result for configuration ${request.configurationId}, scenario ${request.scenarioId}, product ${request.productId}`
                },
                productSummaries[0]
            );
    }
}