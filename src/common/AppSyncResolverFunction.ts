import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class AppSyncResolverFunction<T1, T2> {
    
    context: Context;

    async handleAsync(event: any, context: Context): Promise<any> {

        Log.debug('AppSyncResolverFunction.handle', {event});

        context.callbackWaitsForEmptyEventLoop = false;

        this.context = context;

        const response = await this.resolveRequestAsync(event);

        Log.debug('AppSyncResolverFunction.handle', {response});

        return response;
    }

    abstract resolveRequestAsync(request: T1): Promise<T2>;
}