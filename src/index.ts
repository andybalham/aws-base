import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';

import { DocumentRepository, ProductEngine } from './services';
import S3Client from './common/S3Client';
import DynamoDBClient from './common/DynamoDBClient';
import SNSClient from './common/SNSClient';

import * as AffordabilityApi from './functions/affordabilityApi';
import * as DocumentIndexUpdatePublisher from './functions/documentIndexUpdatePublisher';
import * as DocumentIndexer from './functions/documentIndexer';
import * as DocumentApi from './functions/documentApi';
import * as RecalculationInitiator from './functions/recalculationInitiator';

// TODO 24Nov20: How would we initialise components that require environment variables set by middleware?

const s3Client = new S3Client();
const documentIndexDynamoDbClient = new DynamoDBClient(process.env.DOCUMENT_INDEX_TABLE_NAME);
const documentRepository = new DocumentRepository(new S3Client(process.env.FILE_BUCKET), documentIndexDynamoDbClient);
const documentUpdateSNSClient = new SNSClient(process.env.DOCUMENT_UPDATE_TOPIC);
const productEngine = new ProductEngine();

const affordabilityApiFunction = new AffordabilityApi.Function(documentRepository, productEngine);

export const handleAffordabilityApiFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        return affordabilityApiFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses


const documentApiUpdateFunction = new DocumentApi.UpdateFunction(documentRepository);

export const handleDocumentApiUpdateFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        return documentApiUpdateFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses


const documentIndexerFunction = new DocumentIndexer.Function(s3Client, documentIndexDynamoDbClient);

export const handleDocumentIndexerFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        documentIndexerFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));
            

const documentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(documentUpdateSNSClient);

export const handleDocumentIndexUpdatePublisherFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        documentIndexUpdatePublisherFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));


const recalculationInitiatorFunction = new RecalculationInitiator.Function();

export const handleRecalculationInitiatorFunction =
    middy(async (event: any, context: Context): Promise<any> => {
        recalculationInitiatorFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));
