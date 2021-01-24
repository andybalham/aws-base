import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class TaskFunction<TReq, TRes> {
    
    context: Context;

    async handleAsync(event: any, context: Context): Promise<any> {

        Log.debug('TaskFunction.handle', {event});

        context.callbackWaitsForEmptyEventLoop = false;

        this.context = context;

        const response = await this.handleRequestAsync(event);

        Log.debug('TaskFunction.handle', {response});

        return response;
    }

    abstract handleRequestAsync(request: TReq): Promise<TRes>;
}