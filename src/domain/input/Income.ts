import { IncomeType } from './IncomeType';

export class Income {

    static schema = {
        type: 'object',
        properties: {
            incomeType: { type: 'string', enum: Object.values(IncomeType) },
            annualAmount: { type: 'number'},
        },
        required: ['incomeType', 'annualAmount']
    };

    incomeType: IncomeType;
    annualAmount: number;
}
