import { TaskFunction } from '../../common';
import { Request, Response} from '.';
import { DocumentContentType } from '../../domain/document';
import { DocumentRepository } from '../../services';

export default class RecalculationInitialiserFunction extends TaskFunction<Request, Response> {

    constructor(private documentRepository: DocumentRepository) {
        super();
    }

    async handleRequest(request: Request): Promise<Response> {
        
        let response: Response;

        switch (request.contentType) {

        case DocumentContentType.Configuration:
            response = await this.getConfigurationRecalculatorRequests(request.id);
            break;
            
        case DocumentContentType.Scenario:
            response = await this.getScenarioRecalculatorRequests(request.id);
            break;
            
        case DocumentContentType.Product:
            response = await this.getProductRecalculatorRequests(request.id);
            break;
            
        default:
            throw new Error(`Unhandled document type: ${request.contentType}`);
        }

        return response;
    }

    async getConfigurationRecalculatorRequests(configurationId: string): Promise<Response> {
        
        const scenarioIds = (await this.documentRepository.listScenariosAsync()).map(index => index.id);
        const productIds = (await this.documentRepository.listProductsAsync()).map(index => index.id);

        const recalculatorRequests = this.getRecalculatorRequests([configurationId], scenarioIds, productIds);

        return recalculatorRequests;
    }

    async getScenarioRecalculatorRequests(scenarioId: string): Promise<Response> {
        
        const configurationIds = (await this.documentRepository.listConfigurationsAsync()).map(index => index.id);
        const productIds = (await this.documentRepository.listProductsAsync()).map(index => index.id);

        const recalculatorRequests = this.getRecalculatorRequests(configurationIds, [scenarioId], productIds);

        return recalculatorRequests;
    }

    async getProductRecalculatorRequests(productId: string): Promise<Response> {
        
        const configurationIds = (await this.documentRepository.listConfigurationsAsync()).map(index => index.id);
        const scenarioIds = (await this.documentRepository.listScenariosAsync()).map(index => index.id);

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
