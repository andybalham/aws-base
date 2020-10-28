import { Income } from './Income';

export class Inputs {

    static schema = {
        type: 'object',
        properties: {
            incomes: { 
                type: 'array',
                items: Income.schema
            },
        },
        required: ['incomes']
    };

    incomes: Income[];
}
