import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import CorrelationIds from '@dazn/lambda-powertools-correlation-ids';
import middyCorrelationIds from '@dazn/lambda-powertools-middleware-correlation-ids';
import log from '@dazn/lambda-powertools-logger';
import { StepFunctionsClient, S3Client, SNSClient } from '@andybalham/agb-aws-clients';

import { DocumentRepository, ProductEngine } from './services';
import { DynamoDBSingleTableClient } from './common';

import * as AffordabilityApi from './functions/affordabilityApi';
import * as DocumentIndexUpdatePublisher from './functions/documentIndexUpdatePublisher';
import * as DocumentIndexer from './functions/documentIndexer';
import * as DocumentApi from './functions/documentApi';
import * as RecalculationTrigger from './functions/recalculationTrigger';
import * as RecalculationInitialiser from './functions/recalculationInitialiser';
import * as Recalculator from './functions/recalculator';
import * as DocumentContentResolver from './functions/documentContentResolver';
import { AppSyncBatchResolverFunction, TaskFunction } from '@andybalham/agb-aws-functions';

// TODO 24Nov20: How would we initialise components that require environment variables set by middleware?

const correlationIdParams = { sampleDebugLogRate: 0.01 };

// Configure static aspects of base classes

// TODO 06Apr21: Replace the following static properties
SNSClient.Log = log;
StepFunctionsClient.Log = log;
TaskFunction.Log = log;
AppSyncBatchResolverFunction.Log = log;

// AWS clients

const s3Client = new S3Client();
const documentS3Client = new S3Client(process.env.DOCUMENT_BUCKET);
const documentIndexDynamoDbClient = new DynamoDBSingleTableClient(
  process.env.DOCUMENT_INDEX_TABLE_NAME
);
const documentUpdateSNSClient = new SNSClient(process.env.DOCUMENT_UPDATE_TOPIC);
const recalculationStepFunctionsClient = new StepFunctionsClient(
  process.env.RECALCULATION_STATE_MACHINE_ARN
);

// Domain services

const documentRepository = new DocumentRepository(documentS3Client, documentIndexDynamoDbClient);
const productEngine = new ProductEngine();

// Functions

const affordabilityApiFunction = new AffordabilityApi.Function(documentRepository, productEngine, {
  log,
  getCorrelationIds: CorrelationIds.get,
});

export const handleAffordabilityApiFunction = middy(
  async (event: any, context: Context): Promise<any> => {
    return await affordabilityApiFunction.handleAsync(event, context);
  }
)
  .use(middyCorrelationIds(correlationIdParams))
  .use(httpErrorHandler()); // handles common http errors and returns proper responses

// ---

const documentApiUpdateFunction = new DocumentApi.UpdateFunction(documentRepository, {
  log,
  getCorrelationIds: CorrelationIds.get,
});

export const handleDocumentApiUpdateFunction = middy(
  async (event: any, context: Context): Promise<any> => {
    return await documentApiUpdateFunction.handleAsync(event, context);
  }
)
  .use(middyCorrelationIds(correlationIdParams))
  .use(httpErrorHandler()); // handles common http errors and returns proper responses

// ---

const documentIndexerFunction = new DocumentIndexer.Function(documentRepository, { log });

export const handleDocumentIndexerFunction = middy(
  async (event: any, context: Context): Promise<any> => {
    await documentIndexerFunction.handleAsync(event, context);
  }
).use(middyCorrelationIds(correlationIdParams));

// ---

const documentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(
  documentRepository,
  documentUpdateSNSClient,
  { log }
);

export const handleDocumentIndexUpdatePublisherFunction = middy(
  async (event: any, context: Context): Promise<any> => {
    await documentIndexUpdatePublisherFunction.handleAsync(event, context);
  }
).use(middyCorrelationIds(correlationIdParams));

// ---

const recalculationTriggerFunction = new RecalculationTrigger.Function(
  recalculationStepFunctionsClient,
  { log }
);

export const handleRecalculationTriggerFunction = middy(
  async (event: any, context: Context): Promise<any> => {
    await recalculationTriggerFunction.handleAsync(event, context);
  }
).use(middyCorrelationIds(correlationIdParams));

// ---

const recalculationInitialiserFunction = new RecalculationInitialiser.Function(documentRepository);

export const handleRecalculationInitialiserFunction = middy(
  async (event: any, context: Context): Promise<any> => {
    return await recalculationInitialiserFunction.handleAsync(event, context);
  }
).use(middyCorrelationIds(correlationIdParams));

// ---

const recalculatorFunction = new Recalculator.Function(documentRepository, productEngine);

export const handleRecalculatorFunction = middy(
  async (event: any, context: Context): Promise<any> => {
    return await recalculatorFunction.handleAsync(event, context);
  }
).use(middyCorrelationIds(correlationIdParams));

// ---

const documentContentResolverFunction = new DocumentContentResolver.Function(s3Client);

export const handleDocumentContentResolverFunction = middy(
  async (event: any, context: Context): Promise<any> => {
    return await documentContentResolverFunction.handleAsync(event, context);
  }
).use(middyCorrelationIds(correlationIdParams));
