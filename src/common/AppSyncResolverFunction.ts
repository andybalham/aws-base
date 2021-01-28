import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class AppSyncResolverFunction<TSrc, TRes> {
    
    context: Context;

    async handleAsync(event: any, context: Context): Promise<any> {

        Log.debug('AppSyncResolverFunction.handle', {event});

        context.callbackWaitsForEmptyEventLoop = false;

        this.context = context;
        
        const result = await this.resolveSourceAsync(event.source, event.field);

        Log.debug('AppSyncResolverFunction.handle', {result});

        return result;
    }

    abstract resolveSourceAsync(source: TSrc, field?: string): Promise<TRes>;
}