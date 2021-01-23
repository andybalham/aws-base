import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';

import { DocumentRepository, ProductEngine } from './services';
import S3Client from './common/S3Client';
import DynamoDBClient from './common/DynamoDBClient';
import SNSClient from './common/SNSClient';
import StepFunctionClient from './common/StepFunctionClient';

import * as AffordabilityApi from './functions/affordabilityApi';
import * as DocumentIndexUpdatePublisher from './functions/documentIndexUpdatePublisher';
import * as DocumentIndexer from './functions/documentIndexer';
import * as DocumentApi from './functions/documentApi';
import * as RecalculationTrigger from './functions/recalculationTrigger';
import * as RecalculationInitialiser from './functions/recalculationInitialiser';
import * as Recalculator from './functions/recalculator';
import { DynamoDBSingleTableClient } from './common';

// TODO 24Nov20: How would we initialise components that require environment variables set by middleware?

// AWS clients

const documentS3Client = new S3Client(process.env.DOCUMENT_BUCKET);
const documentMetadataDynamoDbClient = 
    new DynamoDBSingleTableClient(
        new DynamoDBClient(process.env.DOCUMENT_INDEX_TABLE_NAME));
const documentUpdateSNSClient = new SNSClient(process.env.DOCUMENT_UPDATE_TOPIC);
const recalculationStepFunctionClient = new StepFunctionClient(process.env.RECALCULATION_STATE_MACHINE_ARN);

// Domain services

const documentRepository = new DocumentRepository(documentS3Client, documentMetadataDynamoDbClient);
const productEngine = new ProductEngine();

// Functions

const affordabilityApiFunction = new AffordabilityApi.Function(documentRepository, productEngine);

export const handleAffordabilityApiFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        return await affordabilityApiFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses


const documentApiUpdateFunction = new DocumentApi.UpdateFunction(documentRepository);

export const handleDocumentApiUpdateFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        return await documentApiUpdateFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses


const documentIndexerFunction = new DocumentIndexer.Function(documentRepository);

export const handleDocumentIndexerFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        await documentIndexerFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));
            

const documentIndexUpdatePublisherFunction = 
    new DocumentIndexUpdatePublisher.Function(documentRepository, documentUpdateSNSClient);

export const handleDocumentIndexUpdatePublisherFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        await documentIndexUpdatePublisherFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));


const recalculationTriggerFunction = new RecalculationTrigger.Function(recalculationStepFunctionClient);
    
export const handleRecalculationTriggerFunction =
    middy(async (event: any, context: Context): Promise<any> => {
        await recalculationTriggerFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));
    

const recalculationInitialiserFunction = new RecalculationInitialiser.Function(documentRepository);

export const handleRecalculationInitialiserFunction =
    middy(async (event: any, context: Context): Promise<any> => {
        return await recalculationInitialiserFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));
    

const recalculatorFunction = new Recalculator.Function(documentRepository, productEngine);

export const handleRecalculatorFunction =
    middy(async (event: any, context: Context): Promise<any> => {
        return await recalculatorFunction.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }));
        