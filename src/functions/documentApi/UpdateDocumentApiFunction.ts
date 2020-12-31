import { DocumentMetadata } from '../../domain/document';
import { DocumentRepository } from '../../services';
import { UpdateRequest, UpdateResponse } from '.';
import { ApiGatewayFunction } from '../../common';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);

export default class UpdateDocumentApiFunction extends ApiGatewayFunction<UpdateRequest, UpdateResponse> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: UpdateRequest): Promise<UpdateResponse> {
        
        const metadata: DocumentMetadata = {
            type: request.type,
            id: request.id ?? nanoid(),
            description: request.description
        };

        await this.documentRepository.putContent(metadata, request.content);

        return {
            documentType: metadata.type,
            documentId: metadata.id
        };
    }
}
