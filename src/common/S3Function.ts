import { S3Event, S3EventRecord } from 'aws-lambda/trigger/s3';
import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class S3Function {
  event: S3Event;
  context: Context;

  async handleAsync(event: S3Event, context: Context): Promise<void> {
    Log.debug('S3Event', { event });

    if (context) context.callbackWaitsForEmptyEventLoop = false;

    this.event = event;
    this.context = context;

    for (const eventRecord of event.Records) {
      Log.debug('eventRecord', { eventRecord });

      // TODO 25Nov20: Is there a test event from S3?

      await this.handleEventRecordAsync(eventRecord);
    }
  }

  abstract handleEventRecordAsync(eventRecord: S3EventRecord): Promise<void>;
}
