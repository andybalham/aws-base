import { CalculationResults } from '../domain/calculation';
import { Configuration } from '../domain/configuration';
import { Inputs } from '../domain/input';

export default class CalculationEngine {
    evaluate(inputs: Inputs, configuration: Configuration): CalculationResults {

        const applicableIncome =
            inputs.incomes
                .map(income => { 
                    const incomeWeighting = 
                        configuration.incomeWeightings.find(iw => iw.incomeType === income.incomeType)?.weighting ?? 0;
                    return (income.annualAmount * incomeWeighting) / 100;
                })
                .reduce((total, annualAmount) => total + annualAmount, 0);

        return { applicableIncome: applicableIncome };
    }
}