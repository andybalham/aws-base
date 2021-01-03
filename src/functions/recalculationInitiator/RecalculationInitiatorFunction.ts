import { ActivityFunction } from '../../common';
import { Request, Response} from '.';
import { DocumentType } from '../../domain/document';
import { DocumentRepository } from '../../services';

// TODO 03Jan21: Rename all RecalculationInitialiser and TaskFunction
export default class RecalculationInitiatorFunction extends ActivityFunction<Request, Response> {

    constructor(private documentRepository: DocumentRepository) {
        super();
    }

    async handleRequest(request: Request): Promise<Response> {
        
        let response: Response;

        switch (request.documentType) {

        case DocumentType.Configuration:
            response = await this.getConfigurationRecalculatorRequests(request.documentId);
            break;
            
        case DocumentType.Scenario:
            response = await this.getScenarioRecalculatorRequests(request.documentId);
            break;
            
        case DocumentType.Product:
            response = await this.getProductRecalculatorRequests(request.documentId);
            break;
            
        default:
            throw new Error(`Unhandled document type: ${request.documentType}`);
        }

        return response;
    }

    async getConfigurationRecalculatorRequests(configurationId: string): Promise<Response> {
        
        const scenarioIds = (await this.documentRepository.listScenarios()).map(index => index.documentId);
        const productIds = (await this.documentRepository.listProducts()).map(index => index.documentId);

        const recalculatorRequests = this.getRecalculatorRequests([configurationId], scenarioIds, productIds);

        return recalculatorRequests;
    }

    async getScenarioRecalculatorRequests(scenarioId: string): Promise<Response> {
        
        const configurationIds = (await this.documentRepository.listConfigurations()).map(index => index.documentId);
        const productIds = (await this.documentRepository.listProducts()).map(index => index.documentId);

        const recalculatorRequests = this.getRecalculatorRequests(configurationIds, [scenarioId], productIds);

        return recalculatorRequests;
    }

    async getProductRecalculatorRequests(productId: string): Promise<Response> {
        
        const configurationIds = (await this.documentRepository.listConfigurations()).map(index => index.documentId);
        const scenarioIds = (await this.documentRepository.listScenarios()).map(index => index.documentId);

        const recalculatorRequests = this.getRecalculatorRequests(configurationIds, scenarioIds, [productId]);

        return recalculatorRequests;
    }

    private getRecalculatorRequests(
        configurationIds: string[],
        scenarioIds: string[], 
        productIds: string[], 
    ): Response {

        const recalculatorRequests: Response = [];

        for (const configurationId of configurationIds) {
            for (const scenarioId of scenarioIds) {
                for (const productId of productIds) {
                    recalculatorRequests.push({
                        configurationId,
                        scenarioId,
                        productId
                    });
                }
            }
        }

        return recalculatorRequests;
    }
}
