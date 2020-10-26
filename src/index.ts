import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';

import HttpValidatorOptions from './common/HttpValidatorOptions';

import * as affordabilityApi from './functions/affordabilityApi';

export const handleAffordabilityApiFunction = 
    middy(async (event: any): Promise<any> => {
        return affordabilityApi.handle(event);
    })
        .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
        .use(validator(new HttpValidatorOptions(affordabilityApi.requestSchema))) // validates the input
        .use(httpErrorHandler()); // handles common http errors and returns proper responses
