import { ApiGatewayLambda } from '../../common/ApiGatewayLambda';
import { HttpStatusCode } from '../../common/HttpStatusCode';
import { UpdateRequest, UpdateResponse } from '.';

export default class UpdateConfigurationApiLambda extends ApiGatewayLambda<UpdateRequest, UpdateResponse> {

    async handleRequest(request: UpdateRequest): Promise<{ statusCode: HttpStatusCode; content: UpdateResponse }> {
        return {
            statusCode: HttpStatusCode.OK,
            content: {
                correlationId: this.correlationId,
                requestId: this.requestId
            }
        };
    }
}