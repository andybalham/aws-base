import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';

import { AffordabilityApiLambda } from './lambdas/affordabilityApi/AffordabilityApiLambda';
import { ConfigurationRepositoryClient, ProductRepositoryClient } from './services';

const configurationRepository = new ConfigurationRepositoryClient();
const productRepository = new ProductRepositoryClient();
const affordabilityApiLambda = new AffordabilityApiLambda(configurationRepository, productRepository);

export const handleAffordabilityApiFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        return affordabilityApiLambda.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }))
        .use(httpErrorHandler()); // handles common http errors and returns proper responses

