import Log from '@dazn/lambda-powertools-logger';
import { Request, Response } from '.';
import { internalServerError } from '../../common/httpErrors';
import TypedAPIGatewayProxyEvent from '../../common/TypedAPIGatewayProxyEvent';
import TypedAPIGatewayProxyResult, { HttpStatusCode } from '../../common/TypedAPIGatewayProxyResult';

export const handle = async (event: TypedAPIGatewayProxyEvent<Request>): Promise<TypedAPIGatewayProxyResult<Response>> => {
  
    try {
        
        Log.debug(`event.body: ${JSON.stringify(event.body)}`);

        if (event.body.inputs.incomes.length === 0) {
            throw new Error('No incomes supplied!');
        }

        const maximumLoanAmount =
        event.body.inputs.incomes
            .map(income => income.annualAmount)
            .reduce((total, annualAmount) => total + annualAmount, 0)
        * 3.5;

        console.log(`maximumLoanAmount: ${maximumLoanAmount}`);
    
        const response: Response = {
            outputs: {
                productSummaries: [
                    { 
                        productIdentifier: 'PID',
                        productDescription: 'My Product',
                        maximumLoanAmount: maximumLoanAmount
                    }
                ]
            }
        };

        return new TypedAPIGatewayProxyResult(HttpStatusCode.OK, response);

    } catch (error) {
        throw internalServerError(error);
    }
};

