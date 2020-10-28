import { Request, Response } from '.';
import TypedAPIGatewayProxyEvent from '../../common/TypedAPIGatewayProxyEvent';
import TypedAPIGatewayProxyResult, { HttpStatusCode } from '../../common/TypedAPIGatewayProxyResult';

export const handle = async (event: TypedAPIGatewayProxyEvent<Request>): Promise<TypedAPIGatewayProxyResult<Response>> => {
  
    console.log(`event.body: ${JSON.stringify(event.body)}`);

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

    throw new Error('Argh!!!!!!!!');
    
    return new TypedAPIGatewayProxyResult(HttpStatusCode.OK, response);
};