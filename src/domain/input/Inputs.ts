import { Income } from './Income';

export class Inputs {

    static schema = {
        type: 'object',
        properties: {
            stage: {type: 'string'},
            incomes: { 
                type: 'array',
                items: Income.schema
            },
        },
        required: ['stage', 'incomes']
    };

    stage: string;
    incomes: Income[];
}
