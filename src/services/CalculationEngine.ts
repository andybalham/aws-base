import { CalculationResults } from '../domain/calculation';
import { Configuration } from '../domain/configuration';
import { Application } from '../domain/input';

export default class CalculationEngine {
  evaluate(application: Application, configuration: Configuration): CalculationResults {
    const applicableIncome = application.applicants
      .map((applicant) => {
        return [applicant.primaryEmployedAmounts, applicant.secondaryEmployedAmounts]
          .map((employedAmounts) => {
            if (employedAmounts) {
              let amountUsed = employedAmounts.basicSalary * configuration.basicSalaryUsed;
              if (employedAmounts.overtime) {
                amountUsed += employedAmounts.overtime * configuration.overtimeUsed;
              }
              return amountUsed;
            }
            return 0;
          })
          .reduce((total, amount) => total + amount, 0);
      })
      .reduce((total, amount) => total + amount, 0);

    return { applicableIncome: applicableIncome };
  }
}
