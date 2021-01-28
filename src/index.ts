import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';

import { DocumentRepository, ProductEngine } from './services';
import { StepFunctionClient, SNSClient, S3Client, DynamoDBSingleTableClient } from './common';

import * as AffordabilityApi from './functions/affordabilityApi';
import * as DocumentIndexUpdatePublisher from './functions/documentIndexUpdatePublisher';
import * as DocumentIndexer from './functions/documentIndexer';
import * as DocumentApi from './functions/documentApi';
import * as RecalculationTrigger from './functions/recalculationTrigger';
import * as RecalculationInitialiser from './functions/recalculationInitialiser';
import * as Recalculator from './functions/recalculator';
import * as DocumentContentResolver from './functions/documentContentResolver';

// TODO 24Nov20: How would we initialise components that require environment variables set by middleware?

const correlationIdParams = { sampleDebugLogRate: 0.01 };

// AWS clients

const s3Client = new S3Client();
const documentS3Client = new S3Client(process.env.DOCUMENT_BUCKET);
const documentIndexDynamoDbClient = new DynamoDBSingleTableClient(process.env.DOCUMENT_INDEX_TABLE_NAME);
const documentUpdateSNSClient = new SNSClient(process.env.DOCUMENT_UPDATE_TOPIC);
const recalculationStepFunctionClient = new StepFunctionClient(process.env.RECALCULATION_STATE_MACHINE_ARN);

// Domain services

const documentRepository = new DocumentRepository(documentS3Client, documentIndexDynamoDbClient);
const productEngine = new ProductEngine();

// Functions

const affordabilityApiFunction = new AffordabilityApi.Function(documentRepository, productEngine);

export const handleAffordabilityApiFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        return await affordabilityApiFunction.handleAsync(event, context);
    })
        .use(correlationIds(correlationIdParams))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses


const documentApiUpdateFunction = new DocumentApi.UpdateFunction(documentRepository);

export const handleDocumentApiUpdateFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        return await documentApiUpdateFunction.handleAsync(event, context);
    })
        .use(correlationIds(correlationIdParams))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses


const documentIndexerFunction = new DocumentIndexer.Function(documentRepository);

export const handleDocumentIndexerFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        await documentIndexerFunction.handleAsync(event, context);
    })
        .use(correlationIds(correlationIdParams));
            

const documentIndexUpdatePublisherFunction = 
    new DocumentIndexUpdatePublisher.Function(documentRepository, documentUpdateSNSClient);

export const handleDocumentIndexUpdatePublisherFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        await documentIndexUpdatePublisherFunction.handleAsync(event, context);
    })
        .use(correlationIds(correlationIdParams));


const recalculationTriggerFunction = new RecalculationTrigger.Function(recalculationStepFunctionClient);
    
export const handleRecalculationTriggerFunction =
    middy(async (event: any, context: Context): Promise<any> => {
        await recalculationTriggerFunction.handleAsync(event, context);
    })
        .use(correlationIds(correlationIdParams));
    

const recalculationInitialiserFunction = new RecalculationInitialiser.Function(documentRepository);

export const handleRecalculationInitialiserFunction =
    middy(async (event: any, context: Context): Promise<any> => {
        return await recalculationInitialiserFunction.handleAsync(event, context);
    })
        .use(correlationIds(correlationIdParams));
    

const recalculatorFunction = new Recalculator.Function(documentRepository, productEngine);

export const handleRecalculatorFunction =
    middy(async (event: any, context: Context): Promise<any> => {
        return await recalculatorFunction.handleAsync(event, context);
    })
        .use(correlationIds(correlationIdParams));
    

const documentContentResolverFunction = new DocumentContentResolver.Function(s3Client);

export const handleDocumentContentResolverFunction =
    middy(async (event: any, context: Context): Promise<any> => {
        return await documentContentResolverFunction.handleAsync(event, context);
    })
        .use(correlationIds(correlationIdParams));
        