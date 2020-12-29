import { ApiGatewayFunction } from '../../common/ApiGatewayFunction';
import { UpdateRequest, UpdateResponse } from '.';
import DocumentRepository from '../../services/DocumentRepository';
import { DocumentMetadata, DocumentType } from '../../domain/document';

export default class UpdateConfigurationApiLambda extends ApiGatewayFunction<UpdateRequest, UpdateResponse> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: UpdateRequest): Promise<UpdateResponse> {
        
        const configurationMetadata: DocumentMetadata = {
            id: request.configurationType,
            type: DocumentType.Configuration,
            description: 'The client configuration'
        };

        await this.documentRepository.putContent(configurationMetadata, request.configuration);

        return {};
    }
}