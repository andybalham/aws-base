import Log from '@dazn/lambda-powertools-logger';
import createHttpError, { HttpError } from 'http-errors';

export function internalServerError(error: any, msg?: string): HttpError {
    Log.error(msg ?? 'ERROR', error);
    return new createHttpError.InternalServerError(msg);
}
