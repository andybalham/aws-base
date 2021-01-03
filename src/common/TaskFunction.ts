import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class TaskFunction<TReq, TRes> {
    
    context: Context;

    async handle(event: any, context: Context): Promise<any> {

        Log.debug('TaskFunction.handle', {event});

        this.context = context;

        const response = await this.handleRequest(event);

        Log.debug('TaskFunction.handle', {response});

        return response;
    }

    abstract handleRequest(request: TReq): Promise<TRes>;
}