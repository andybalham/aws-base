import { Product } from '../domain/product';

export default class ProductRepositoryClient {

    async getProducts(): Promise<Product[]> {
        return [
            new Product('PID-3.5', '3.5x product', 3.5),
            new Product('PID-2.0', '2.0x product', 2.0),
        ];
    }
}