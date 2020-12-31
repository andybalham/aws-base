import { ApiGatewayFunction } from '../../common/ApiGatewayFunction';
import DocumentRepository from '../../services/DocumentRepository';
import { DocumentMetadata, DocumentType } from '../../domain/document';
import { UpdateRequest, UpdateResponse } from '.';

export default class UpdateConfigurationApiFunction extends ApiGatewayFunction<UpdateRequest, UpdateResponse> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: UpdateRequest): Promise<UpdateResponse> {
        
        if (request.configurationType !== 'client') {
            throw new Error(`Configuration type not supported: '${request.configurationType}'`);
        }
        
        const metadata: DocumentMetadata = {
            id: request.configurationType,
            type: DocumentType.Configuration,
            description: 'The client configuration'
        };

        await this.documentRepository.putContent(metadata, request.configuration);

        return {
            documentType: metadata.type,
            documentId: metadata.id
        };
    }
}