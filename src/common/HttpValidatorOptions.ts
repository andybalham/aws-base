export default class HttpValidatorOptions {

    constructor(inputSchema?: any, outputSchema?: any) {
        this.inputSchema = inputSchema ? new HttpRequestSchema(inputSchema) : undefined;
        this.outputSchema = outputSchema ? new HttpResponseSchema(outputSchema) : undefined;
    }
    
    inputSchema?: any;
    outputSchema?: any;
}

class HttpRequestSchema {

    constructor(bodySchema: any) {
        this.properties = { body: bodySchema };
    }
    
    type = 'object';
    properties: any;
    required: ['body'];
}

class HttpResponseSchema {

    constructor(bodySchema: any) {
        this.properties = { 
            body: bodySchema,
            statusCode: {
                type: 'number'
            }
        };
    }
    
    type = 'object';
    properties: any;
    required: ['body', 'statusCode'];
}
