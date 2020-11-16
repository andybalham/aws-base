import S3 from 'aws-sdk/clients/s3';
import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';

import { AffordabilityApiLambda } from './lambdas/affordabilityApi/AffordabilityApiLambda';
import { DocumentRepository } from './services';
import UpdateConfigurationApiLambda from './lambdas/configurationApi/UpdateConfigurationApiLambda';

const s3 = new S3(); // TODO 16Nov20: Configure to reuse connections
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
        
        
