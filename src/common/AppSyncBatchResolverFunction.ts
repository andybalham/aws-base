import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class AppSyncBatchResolverFunction<TSrc, TRes> {
    
    context: Context;

    async handleAsync(events: any[], context: Context): Promise<any> {

        Log.debug('AppSyncResolverFunction.handle', {events});

        context.callbackWaitsForEmptyEventLoop = false;

        this.context = context;

        const results: any[] = [];

        for (const event of events) {
            try {                
                
                const result = await this.resolveSourceAsync(event.source, event.field) as TRes;
                results.push({data: result});

            } catch (error) {                
                Log.error(`Error resolving: ${JSON.stringify({source: event.source, field: event.field})}`, error);
                results.push({ 'data': null, 'errorMessage': error.message, 'errorType': 'ERROR' });                    
            }
        }

        Log.debug('AppSyncResolverFunction.handle', {results});

        return results;
    }

    abstract resolveSourceAsync(source: TSrc, field?: string): Promise<TRes>;
}