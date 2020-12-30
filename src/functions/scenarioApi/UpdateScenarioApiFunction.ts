import { DocumentMetadata, DocumentType } from '../../domain/document';
import { DocumentRepository } from '../../services';
import { UpdateRequest, UpdateResponse } from '.';
import { ApiGatewayFunction } from '../../common';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);

export default class UpdateScenarioApiFunction extends ApiGatewayFunction<UpdateRequest, UpdateResponse> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: UpdateRequest): Promise<UpdateResponse> {
        
        const metadata: DocumentMetadata = {
            id: request.id ?? nanoid(),
            type: DocumentType.Scenario,
            description: request.description
        };

        await this.documentRepository.putContent(metadata, request.application);

        return {
            documentType: metadata.type,
            documentId: metadata.id
        };
    }
}
