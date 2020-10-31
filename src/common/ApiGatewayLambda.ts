import { Context } from 'aws-lambda/handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';

import createHttpError from 'http-errors';
import Log from '@dazn/lambda-powertools-logger';
import CorrelationIds from '@dazn/lambda-powertools-correlation-ids';

import { HttpStatusCode } from './HttpStatusCode';

export abstract class ApiGatewayLambda<TReq, TRes> {

    event: APIGatewayProxyEvent;
    context: Context;
    requestId: string;
    correlationId: string;

    async handle(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  {
            
        this.event = event;
        this.context = context;

        // TODO 31Oct20: We could even do the parsing and validation, both for the input and output

        const correlationIds = CorrelationIds.get();
        this.requestId = correlationIds.awsRequestId;
        this.correlationId = correlationIds['x-correlation-id'];

        // TODO 31Oct20: Allow for other ways of assembling the requests
        // TODO 31Oct20: Allow for input schema validation
        const request: TReq = JSON.parse(event.body ?? '{}');

        try {

            const response = await this.handleRequest(request);

            // TODO 31Oct20: Allow for output schema validation

            return {
                // TODO 31Oct20: Allow for other status codes
                statusCode: response.statusCode,
                body: JSON.stringify(response.content)
            };

        } catch (error) {

            Log.error('Error handling request', error);

            throw new createHttpError.InternalServerError(JSON.stringify({
                message: 'Internal Server Error',
                correlationId: this.correlationId,
                requestId: this.requestId,
            }));
        }
    }

    abstract handleRequest(request: TReq): Promise<{statusCode: HttpStatusCode; content: TRes}>;
}

