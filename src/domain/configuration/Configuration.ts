import { IncomeType } from '../input';

export default class Configuration {
    constructor(
        public incomeWeightings: Map<IncomeType, number>
    ) {}
}