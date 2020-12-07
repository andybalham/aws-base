import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';

import { DocumentRepository } from './services';
import AffordabilityApiFunction from './functions/affordabilityApi/AffordabilityApiFunction';
import UpdateConfigurationApiLambda from './functions/configurationApi/UpdateConfigurationApiLambda';
import DocumentIndexerFunction from './functions/documentIndexer/DocumentIndexerFunction';
import S3Client from './common/S3Client';
import DynamoDBClient from './common/DynamoDBClient';

// TODO 24Nov20: How would we initialise components that require environment variables set by middleware?

const s3Client = new S3Client();
const fileIndexDynamoDbClient = new DynamoDBClient(process.env.FILE_INDEX_TABLE_NAME);
const documentRepository = new DocumentRepository(new S3Client(process.env.FILE_BUCKET));

const affordabilityApiLambda = new AffordabilityApiFunction(documentRepository);

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


const documentIndexerFunction = new DocumentIndexerFunction(s3Client, fileIndexDynamoDbClient);

export const handleDocumentUpdate = 
    middy(async (event: any, context: Context): Promise<any> => {
        documentIndexerFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));
            
