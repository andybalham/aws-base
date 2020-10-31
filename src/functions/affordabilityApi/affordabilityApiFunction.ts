import { Request, Response } from '.';
import HttpContextIds from '../../common/HttpContextIds';
import { internalServerError } from '../../common/httpErrors';
import TypedAPIGatewayProxyEvent from '../../common/TypedAPIGatewayProxyEvent';
import TypedAPIGatewayProxyResult, { HttpStatusCode } from '../../common/TypedAPIGatewayProxyResult';

export const handle = async (event: TypedAPIGatewayProxyEvent<Request>): Promise<TypedAPIGatewayProxyResult<Response>> => {
    try {

        console.log(`event: ${JSON.stringify(event)}`);

        if (event.body.inputs.incomes.length === 0) {
            throw new Error('No incomes supplied!');
        }

        const maximumLoanAmount =
            event.body.inputs.incomes
                .map(income => income.annualAmount)
                .reduce((total, annualAmount) => total + annualAmount, 0)
            * 3.5;

        const response: Response = {
            correlationId: HttpContextIds.correlationId,
            requestId: HttpContextIds.requestId,
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

