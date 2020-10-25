import { Request, Response } from '.';
import ParsedAPIGatewayProxyEvent from '../../common/ParsedAPIGatewayProxyEvent';

export const handle = async (event: ParsedAPIGatewayProxyEvent<Request>): Promise<Response> => {
    return {
        requestJson: JSON.stringify(event.body)
    };
};