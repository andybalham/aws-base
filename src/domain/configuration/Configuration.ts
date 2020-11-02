import { IncomeType } from '../input';

export default class Configuration {
    constructor(
        public incomeWeightings: Array<{incomeType: IncomeType; weighting: number}>
    ) {}
}