import { Context } from 'aws-lambda/handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';

import createHttpError from 'http-errors';
import Log from '@dazn/lambda-powertools-logger';
import CorrelationIds from '@dazn/lambda-powertools-correlation-ids';

import { HttpStatusCode } from './HttpStatusCode';

export default abstract class ApiGatewayFunction<TReq, TRes> {

    responseStatusCode = HttpStatusCode.OK;
    includeCorrelationAndRequestIds = true;

    event: APIGatewayProxyEvent;
    context?: Context;
    requestId: string;
    correlationId: string;
    
    async handle(event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult>  {
            
        Log.debug('APIGatewayProxyEvent', {event});

        if (context) context.callbackWaitsForEmptyEventLoop = false;

        this.event = event;
        this.context = context;

        const correlationIds = CorrelationIds.get();
        this.requestId = correlationIds.awsRequestId;
        this.correlationId = correlationIds['x-correlation-id'];

        const request: TReq = this.getRequest(event);

        // TODO 31Oct20: Allow for input schema validation

        try {

            const response = await this.handleRequest(request);

            if (this.includeCorrelationAndRequestIds && (response !== undefined)) {
                (response as any).correlationId = this.correlationId;
                (response as any).requestId = this.requestId;
            }

            const result = {
                statusCode: this.responseStatusCode,
                body: (typeof response !== 'undefined') ? JSON.stringify(response) : JSON.stringify({}),
            };

            // TODO 31Oct20: Allow for output schema validation

            return result;

        } catch (error) {

            Log.error('Error handling request', error);

            throw new createHttpError.InternalServerError(JSON.stringify({
                message: 'Internal Server Error',
                correlationId: this.correlationId,
                requestId: this.requestId,
            }));
        }
    }

    protected getRequest(event: APIGatewayProxyEvent): TReq {
        
        const request = JSON.parse(event.body ?? '{}');

        for (const name in event.pathParameters) {
            request[name] = event.pathParameters[name];
        }

        for (const name in event.queryStringParameters) {
            request[name] = event.queryStringParameters[name];
        }

        return request;
    }

    abstract handleRequest(request: TReq): Promise<TRes>;
}

