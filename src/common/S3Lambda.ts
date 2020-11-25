import { S3Event, S3EventRecord } from 'aws-lambda/trigger/s3';
import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class S3Lambda {
    
    event: S3Event;
    context: Context;

    async handle(event: S3Event, context: Context): Promise<void> {
            
        Log.debug('S3Event', {event});

        for (const eventRecord of event.Records) {
        
            Log.debug('eventRecord', {eventRecord});

            this.event = event;
            this.context = context;

            // TODO 25Nov20: Is there a test event from S3?

            await this.handleEventRecord(eventRecord);
        }
    }

    abstract handleEventRecord(eventRecord: S3EventRecord): Promise<void>;
}