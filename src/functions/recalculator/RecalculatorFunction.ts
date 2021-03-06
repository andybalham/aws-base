import { TaskFunction } from '../../common';
import { Request } from '.';
import { DocumentRepository, ProductEngine } from '../../services';
import { DocumentContentType } from '../../domain/document';

export default class RecalculatorFunction extends TaskFunction<Request, void> {
  constructor(
    private documentRepository: DocumentRepository,
    private productEngine: ProductEngine
  ) {
    super();
  }

  async handleRequestAsync(request: Request): Promise<void> {
    const configuration = await this.documentRepository.getConfigurationAsync(
      request.configurationId
    );
    const scenario = await this.documentRepository.getApplicationAsync(request.scenarioId);
    const product = await this.documentRepository.getProductAsync(request.productId);

    const configurationIndex = await this.documentRepository.getIndexAsync(
      DocumentContentType.Configuration,
      request.configurationId
    );
    const scenarioIndex = await this.documentRepository.getIndexAsync(
      DocumentContentType.Scenario,
      request.scenarioId
    );
    const productIndex = await this.documentRepository.getIndexAsync(
      DocumentContentType.Product,
      request.productId
    );

    const productSummaries = this.productEngine.calculateProductSummaries(configuration, scenario, [
      product,
    ]);

    await this.documentRepository.putContentAsync(
      {
        id: `${request.scenarioId}-${request.productId}-${request.configurationId}`,
        contentType: DocumentContentType.Result,
        description: `Result for '${scenarioIndex.description}' & '${productIndex.description}' with '${configurationIndex.description}' configuration`,
      },
      productSummaries[0] // TODO 13Jan21: We should store a Scenario object here, with a description
    );
  }
}
