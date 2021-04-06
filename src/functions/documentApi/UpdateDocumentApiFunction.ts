import { DocumentRepository } from '../../services';
import { UpdateRequest, UpdateResponse } from '.';
import { ApiGatewayFunction } from '@andybalham/agb-aws-functions';
import { ApiGatewayFunctionProps } from '@andybalham/agb-aws-functions/ApiGatewayFunction';

export default class UpdateDocumentApiFunction extends ApiGatewayFunction<
  UpdateRequest,
  UpdateResponse
> {
  constructor(private documentRepository: DocumentRepository, props?: ApiGatewayFunctionProps) {
    super(props);
  }

  async handleRequestAsync(request: UpdateRequest): Promise<UpdateResponse> {
    const id = await this.documentRepository.putContentAsync(
      {
        id: request.id,
        contentType: request.contentType,
        description: request.description,
      },
      request.content
    );

    return {
      id,
    };
  }
}
