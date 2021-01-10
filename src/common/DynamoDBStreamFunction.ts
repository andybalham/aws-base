import { Context } from 'aws-lambda/handler';
import Log from '@dazn/lambda-powertools-logger';
import { DynamoDBStreamEvent } from 'aws-lambda/trigger/dynamodb-stream';
import DynamoDB from 'aws-sdk/clients/dynamodb';

export default abstract class DynamoDBStreamFunction<T> {
    
    event: DynamoDBStreamEvent;
    context: Context;

    async handle(event: DynamoDBStreamEvent, context: Context): Promise<void> {
            
        Log.debug('DynamoDBStreamEvent', {event});

        context.callbackWaitsForEmptyEventLoop = false;

        this.event = event;
        this.context = context;

        for (const eventRecord of event.Records) {
        
            Log.debug('eventRecord', {eventRecord});

            const eventName = eventRecord.eventName;            
            
            const oldImage = 
                eventRecord.dynamodb?.OldImage === undefined 
                    ? undefined
                    : DynamoDB.Converter.unmarshall(eventRecord.dynamodb.OldImage) as T;
            
            const newImage = 
                eventRecord.dynamodb?.NewImage === undefined
                    ? undefined
                    : DynamoDB.Converter.unmarshall(eventRecord.dynamodb.NewImage) as T;

            await this.processEventRecord(eventName, oldImage, newImage);
        }
    }

    abstract processEventRecord(
        eventType?: DynamoDBEventTypes, oldImage?: T, newImage?: T): Promise<void>
}

export enum DynamoDBEventType {
    INSERT,
    MODIFY,
    REMOVE,
}

export type DynamoDBEventTypes = keyof typeof DynamoDBEventType