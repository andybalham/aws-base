export default class HttpValidatorOptions {

    constructor(bodySchema: any) {
        this.inputSchema = new HttpSchema(bodySchema);
    }
    
    inputSchema?: any;
}

class HttpSchema {

    constructor(bodySchema: any) {
        this.properties = { body: bodySchema };
    }
    
    type = 'object'
    properties: HttpSchemaProperties
}

class HttpSchemaProperties {
    body: any
}
