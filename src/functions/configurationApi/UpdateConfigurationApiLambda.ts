import { ApiGatewayLambda } from '../../common/ApiGatewayLambda';
import { UpdateRequest, UpdateResponse } from '.';
import { DocumentType, DocumentMetadata, DocumentRepository } from '../../services';

export default class UpdateConfigurationApiLambda extends ApiGatewayLambda<UpdateRequest, UpdateResponse> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: UpdateRequest): Promise<UpdateResponse> {
        
        const configurationMetadata: DocumentMetadata = {
            id: request.configurationType,
            type: DocumentType.configuration,
            description: 'The client configuration'
        };

        await this.documentRepository.putContent(configurationMetadata, request.configuration);

        return {};
    }
}