import { S3Client } from '@andybalham/agb-aws-clients';
import { AppSyncBatchResolverFunction } from '@andybalham/agb-aws-functions';
import { DocumentIndex } from '../../domain/document';
import { ProductSummary } from '../../domain/output';

export default class DocumentContentResolverFunction extends AppSyncBatchResolverFunction<
  DocumentIndex,
  ProductSummary
> {
  constructor(private s3Client: S3Client) {
    super();
  }

  async resolveSourceAsync(documentIndex: DocumentIndex): Promise<ProductSummary> {
    // if (documentIndex.id.match('92onBhBN917U')) {
    //     throw new Error('I don\'t like the look of 92onBhBN917U');
    // }
    return await this.s3Client.getObjectAsync<ProductSummary>(
      documentIndex.s3Key,
      documentIndex.s3BucketName
    );
  }
}
