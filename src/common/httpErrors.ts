import Log from '@dazn/lambda-powertools-logger';
import createHttpError, { HttpError } from 'http-errors';
import HttpContextIds from './HttpContextIds';

export function internalServerError(error: any, msg?: string): HttpError {
    
    Log.error(msg ?? 'ERROR', error);

    return new createHttpError.InternalServerError(JSON.stringify({
        correlationId: HttpContextIds.correlationId,
        requestId: HttpContextIds.requestId,
        message: msg,
    }));
}
