export default class TypedAPIGatewayProxyEvent<T> {

    body: T;
    headers: { [name: string]: string };
    multiValueHeaders: { [name: string]: string[] };
    httpMethod: string;
    isBase64Encoded: boolean;
    path: string;
    pathParameters: { [name: string]: string } | null;
    queryStringParameters: { [name: string]: string } | null;
    multiValueQueryStringParameters: { [name: string]: string[] } | null;
    stageVariables: { [name: string]: string } | null;
    // requestContext: APIGatewayEventRequestContextWithAuthorizer<TAuthorizerContext>;
    resource: string;    
}

