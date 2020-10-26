import { Request, Response } from '.';
import TypedAPIGatewayProxyEvent from '../../common/TypedAPIGatewayProxyEvent';
import TypedAPIGatewayProxyResult, { HttpStatusCode } from '../../common/TypedAPIGatewayProxyResult';

export const handle = async (event: TypedAPIGatewayProxyEvent<Request>): Promise<TypedAPIGatewayProxyResult<Response>> => {
    
    const response: Response = {
        requestJson: JSON.stringify(event.body)
    };

    return new TypedAPIGatewayProxyResult(HttpStatusCode.OK, response);
};