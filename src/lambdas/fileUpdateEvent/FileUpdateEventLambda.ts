import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

import { S3Event } from 'aws-lambda/trigger/s3';

abstract class SQSEventLambda<T> {
    
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

export default class FileUpdateEventLambda extends SQSEventLambda<S3Event> {
    
    async handleMessage(s3Event: S3Event): Promise<void> {

        Log.debug('s3Event', {s3Event});
    }
}