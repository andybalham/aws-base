import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class SQSLambda<T> {
    
    event: SQSEvent;
    context: Context;

    async handle(event: SQSEvent, context: Context): Promise<void> {
            
        Log.debug('SQSEvent', {event});

        for (const eventRecord of event.Records) {
        
            Log.debug('eventRecord', {eventRecord});

            this.event = event;
            this.context = context;
    
            const message = JSON.parse(eventRecord.body);

            if (message.Event?.endsWith(':TestEvent')) {
                Log.info('Skipping test event', {messageEvent: message.Event});
            }

            await this.handleMessage(message);
        }
    }

    abstract handleMessage(message: T): Promise<void>;
}

