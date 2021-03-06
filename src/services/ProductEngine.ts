import { CalculationEngine } from '.';
import { Configuration } from '../domain/configuration';
import { Application } from '../domain/input';
import { Product, ProductSummary } from '../domain/product';

export default class ProductEngine {
  calculateProductSummaries(
    configuration: Configuration,
    application: Application,
    products: Product[]
  ): ProductSummary[] {
    const calculationEngine = new CalculationEngine();

    const calculationResults = calculationEngine.evaluate(application, configuration);

    const productSummaries = products.map((product) => {
      const maximumLoanAmount = calculationResults.applicableIncome * product.incomeMultiplier;

      return {
        product,
        maximumLoanAmount,
      };
    });

    return productSummaries;
  }
}
