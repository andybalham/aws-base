import { Context } from 'aws-lambda/handler';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';

import { CalculationEngineClient, ConfigurationClient } from './services';
import { AffordabilityApiLambda } from './lambdas/affordabilityApi/AffordabilityApiLambda';

const configurationClient = new ConfigurationClient();
const calculationEngineClient = new CalculationEngineClient();
const affordabilityApiLambda = new AffordabilityApiLambda(configurationClient, calculationEngineClient);

export const handleAffordabilityApiFunction = 
    middy(async (event: any, context: Context): Promise<any> => {
        return affordabilityApiLambda.handle(event, context);
    })
        .use(correlationIds({ sampleDebugLogRate: 0.01 }))
        .use(httpErrorHandler()) // handles common http errors and returns proper responses
        ;
