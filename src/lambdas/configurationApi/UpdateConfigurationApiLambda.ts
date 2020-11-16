import { ApiGatewayLambda, ApiGatewayLambdaResponse } from '../../common/ApiGatewayLambda';
import { HttpStatusCode } from '../../common/HttpStatusCode';
import { UpdateRequest, UpdateResponse } from '.';
import { DocumentType, DocumentMetadata, DocumentRepository } from '../../services';

export default class UpdateConfigurationApiLambda extends ApiGatewayLambda<UpdateRequest, UpdateResponse> {

    constructor(
        private documentRepository: DocumentRepository,
    ) {
        super();
    }

    async handleRequest(request: UpdateRequest): Promise<ApiGatewayLambdaResponse<UpdateResponse>> {
        
        const configurationMetadata: DocumentMetadata = {
            id: request.configurationType,
            type: DocumentType.configuration,
            description: 'The client configuration'
        };

        await this.documentRepository.put(configurationMetadata, request.configuration);

        return {
            statusCode: HttpStatusCode.OK,
            content: {
                correlationId: this.correlationId,
                requestId: this.requestId
            }
        };
    }
}