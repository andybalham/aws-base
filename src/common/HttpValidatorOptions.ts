export default class HttpValidatorOptions {

    constructor(inputSchema?: any, outputSchema?: any) {
        this.inputSchema = inputSchema ? new HttpRequestSchema(inputSchema) : undefined;
    }
    
    inputSchema?: any;
}

class HttpRequestSchema {

    constructor(bodySchema: any) {
        this.properties = { body: bodySchema };
    }
    
    type = 'object';
    properties: any;
    required: ['body'];
}
