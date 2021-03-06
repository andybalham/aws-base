import { SNSEvent } from 'aws-lambda/trigger/sns';
import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';

export default abstract class SNSFunction<T> {
  event: SNSEvent;
  context: Context;

  async handleAsync(event: SNSEvent, context: Context): Promise<void> {
    Log.debug('SNSEvent', { event });

    context.callbackWaitsForEmptyEventLoop = false;

    this.event = event;
    this.context = context;

    for (const eventRecord of event.Records) {
      Log.debug('eventRecord', { eventRecord });

      const message = JSON.parse(eventRecord.Sns.Message);

      if (message.Event?.endsWith(':TestEvent')) {
        Log.info('Skipping test event', { messageEvent: message.Event });
        break;
      }

      await this.handleMessageAsync(message);
    }
  }

  abstract handleMessageAsync(message: T): Promise<void>;
}
