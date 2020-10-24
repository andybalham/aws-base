import middy from '@middy/core';
import * as BasicFunction from './functions/basicFunction';

export const handleBasicFunction = middy(async (event: any): Promise<any> => {
    return BasicFunction.handle(event);
});

// export const handleBasicFunction = middy((event: any): any => {
//     return uuidv4();
//     // return BasicFunction.handle(event);
// });

/*
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
  .use(validator({inputSchema})) // validates the input
  .use(httpErrorHandler()) // handles common http errors and returns proper responses
*/
