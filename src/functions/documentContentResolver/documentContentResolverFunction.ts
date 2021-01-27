import { AppSyncResolverFunction, S3Client } from '../../common';
import { ProductSummary } from '../../domain/output';

export default class DocumentContentResolverFunction 
    extends AppSyncResolverFunction<{s3Key: string; s3BucketName: string}, ProductSummary> {

    constructor(private s3Client: S3Client) {
        super();
    }

    async resolveRequestAsync({s3Key, s3BucketName}): Promise<ProductSummary> {
        return await this.s3Client.getObjectAsync<ProductSummary>(s3Key, s3BucketName);
    }
}