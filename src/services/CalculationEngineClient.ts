import { CalculationResults } from '../domain/calculation';
import { Configuration } from '../domain/configuration';
import { Inputs } from '../domain/input';

export default class CalculationEngineClient {
    evaluate(inputs: Inputs, configuration: Configuration): CalculationResults {

        const maximumLoanAmount =
            inputs.incomes
                .map(income => income.annualAmount)
                .reduce((total, annualAmount) => total + annualAmount, 0)
                * 3.5;

        return { maximumLoanAmount: maximumLoanAmount };
    }
}