import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
// import httpResponseSerializer from '@middy/http-response-serializer';
import validator from '@middy/validator';

import HttpValidatorOptions from './common/HttpValidatorOptions';
// import jsonHttpResponseSerializerOptions from './common/jsonHttpResponseSerializerOptions';

import * as affordabilityApi from './functions/affordabilityApi';

export const handleAffordabilityApiFunction = 
    middy(async (event: any): Promise<any> => {
        return affordabilityApi.handle(event);
    })
        .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
        // .use(httpResponseSerializer(jsonHttpResponseSerializerOptions))
        .use(validator(new HttpValidatorOptions(affordabilityApi.Request.schema/*, affordabilityApi.Response.schema*/))) // validates the input and output
        .use(httpErrorHandler()) // handles common http errors and returns proper responses
        ;
