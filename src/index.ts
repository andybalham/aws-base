import S3 from 'aws-sdk/clients/s3';
import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';

import { DocumentRepository } from './services';
import AffordabilityApiLambda from './lambdas/affordabilityApi/AffordabilityApiLambda';
import UpdateConfigurationApiLambda from './lambdas/configurationApi/UpdateConfigurationApiLambda';
import FileUpdateEventLambda from './lambdas/fileUpdateEvent/FileUpdateEventLambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

// TODO 24Nov20: How would we initialise components that require environment variables set by middleware?

// TODO 16Nov20: Wrap to reuse connections?
const s3 = new S3();
const documentClient = new DocumentClient();

const documentRepository = new DocumentRepository(s3, process.env.FILE_BUCKET);


const affordabilityApiLambda = new AffordabilityApiLambda(documentRepository);

export const handleAffordabilityApiRequest = 
    middy(async (event: any, context: Context): Promise<any> => {
        return affordabilityApiLambda.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses


const updateConfigurationApiLambda = new UpdateConfigurationApiLambda(documentRepository);

export const handleUpdateConfigurationApiRequest = 
    middy(async (event: any, context: Context): Promise<any> => {
        return updateConfigurationApiLambda.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses


const fileUpdateEventLambda = new FileUpdateEventLambda(s3, documentClient, process.env.FILE_INDEX_TABLE_NAME);

export const handleFileUpdateEvent = 
    middy(async (event: any, context: Context): Promise<any> => {
        fileUpdateEventLambda.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));
            
