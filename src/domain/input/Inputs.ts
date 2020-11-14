import { Income } from './Income';

export class Inputs {

    incomes: Income[];

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
}
