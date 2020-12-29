import { CalculationEngine } from '.';
import { ClientConfiguration } from '../domain/configuration';
import { Application } from '../domain/input';
import { Product, ProductSummary } from '../domain/product';

export default class ProductEngine {

    calculateProductSummaries(
        clientConfiguration: ClientConfiguration, 
        application: Application, 
        products: Product[]
    ): ProductSummary[] {

        const calculationEngine = new CalculationEngine();

        const calculationResults = calculationEngine.evaluate(application, clientConfiguration);

        const productSummaries = products.map(product => {

            const maximumLoanAmount = calculationResults.applicableIncome * product.incomeMultiplier;

            return {
                product,
                maximumLoanAmount
            };
        });

        return productSummaries;
    }

}