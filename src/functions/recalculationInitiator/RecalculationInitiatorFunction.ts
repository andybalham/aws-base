import { SNSMessage } from 'aws-lambda';
import { SQSFunction, StepFunctionClient } from '../../common';
import { DocumentIndex, DocumentType } from '../../domain/document';
import { DocumentRepository } from '../../services';
import * as Recalculator from '../recalculator';

export default class RecalculationInitiatorFunction extends SQSFunction<SNSMessage> {

    constructor(private documentRepository: DocumentRepository, private recalculationStepFunctionClient: StepFunctionClient) {
        super();
    }

    async handleMessage(message: SNSMessage): Promise<void> {
        
        const documentIndex: DocumentIndex = JSON.parse(message.Message);

        let recalculatorRequests: Recalculator.Request[];

        switch (documentIndex.documentType) {

        case DocumentType.Configuration:
            recalculatorRequests = 
                await this.getConfigurationRecalculatorRequest(documentIndex.documentId);
            break;
            
        case DocumentType.Scenario:
            recalculatorRequests = 
                await this.getScenarioRecalculatorRequest(documentIndex.documentId);
            break;
            
        case DocumentType.Product:
            recalculatorRequests = 
                    await this.getProductRecalculatorRequest(documentIndex.documentId);
            break;
            
        default:
            throw new Error(`Unhandled document type: ${documentIndex.documentType}`);
        }

        await this.recalculationStepFunctionClient.startExecution(recalculatorRequests);
    }

    async getConfigurationRecalculatorRequest(configurationId: string): Promise<Recalculator.Request[]> {
        
        const scenarioIds = (await this.documentRepository.listScenarios()).map(index => index.documentId);
        const productIds = (await this.documentRepository.listProducts()).map(index => index.documentId);

        const recalculatorRequests = this.getRecalculatorRequests([configurationId], scenarioIds, productIds);

        return recalculatorRequests;
    }

    async getScenarioRecalculatorRequest(scenarioId: string): Promise<Recalculator.Request[]> {
        
        const configurationIds = (await this.documentRepository.listConfigurations()).map(index => index.documentId);
        const productIds = (await this.documentRepository.listProducts()).map(index => index.documentId);

        const recalculatorRequests = this.getRecalculatorRequests(configurationIds, [scenarioId], productIds);

        return recalculatorRequests;
    }

    async getProductRecalculatorRequest(productId: string): Promise<Recalculator.Request[]> {
        
        const configurationIds = (await this.documentRepository.listConfigurations()).map(index => index.documentId);
        const scenarioIds = (await this.documentRepository.listScenarios()).map(index => index.documentId);

        const recalculatorRequests = this.getRecalculatorRequests(configurationIds, scenarioIds, [productId]);

        return recalculatorRequests;
    }

    private getRecalculatorRequests(
        configurationIds: string[],
        scenarioIds: string[], 
        productIds: string[], 
    ): Recalculator.Request[] {

        const recalculatorRequests: Recalculator.Request[] = [];

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
