import { Product } from '../domain/product';

export default class ProductRepositoryClient {

    async getProduct(productIdentifier: string): Promise<Product> {
        return new Product(productIdentifier, `${productIdentifier} description`, 3.5);
    }
}