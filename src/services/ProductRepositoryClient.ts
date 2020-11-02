import S3, { GetObjectRequest, ListObjectsV2Request } from 'aws-sdk/clients/s3';
import { Product } from '../domain/product';

export default class ProductRepositoryClient {

    constructor(private s3Client?: S3, private fileBucket?: string) {}

    async getProducts(): Promise<Product[]> {

        if (this.s3Client === undefined) throw new Error('this.s3Client === undefined');
        if (this.fileBucket === undefined) throw new Error('this.fileBucket === undefined');

        const listProductsParams: ListObjectsV2Request = {
            Bucket: this.fileBucket,
            Prefix: 'product/product-'
        };
    
        const listProductsResult = await this.s3Client.listObjectsV2(listProductsParams).promise();

        if (listProductsResult.Contents === undefined) {
            throw new Error(`Could not list products for params: ${JSON.stringify(listProductsParams)}`);
        }

        const products: Product[] = [];

        for (const listProductsResultContent of listProductsResult.Contents) {
            
            const getProductParams: GetObjectRequest = {
                Bucket: this.fileBucket,
                Key: listProductsResultContent.Key ?? 'undefined',
            };
        
            const getProductResult = await this.s3Client.getObject(getProductParams).promise();
    
            if (getProductResult.Body === undefined) {                
                throw new Error(`Could not load product for: ${JSON.stringify(getProductParams)}`);
            }
    
            const productJson = getProductResult.Body.toString('utf-8');
            console.log(`productJson: ${productJson}`);

            const product = JSON.parse(productJson);
            products.push(product);
        }

        return products;
    }
}