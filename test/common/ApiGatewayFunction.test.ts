import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import { ApiGatewayFunction } from '../../src/common';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

describe('Test ApiGatewayFunction', () => {

    it('POST parses and stringifies and returns OK by default', async () => {
   
        // Arrange

        class Request { input: string }        
        class Response { output: string}

        class TestApiGatewayFunction extends ApiGatewayFunction<Request, Response> {
            async handleRequest(request: Request): Promise<Response> {
                return { output: request.input};
            }            
        }
        
        const request: Request = { input: 'XXX' };
        const event = getAPIGatewayProxyPOSTEvent(request);

        const sutTestApiGatewayFunction = new TestApiGatewayFunction();

        // Act

        const actualResult = await sutTestApiGatewayFunction.handle(event);

        // Assert

        expect(actualResult).to.not.be.undefined;
        expect(actualResult.statusCode).to.equal(200);

        const actualResponse: Response = JSON.parse(actualResult.body);

        expect(actualResponse.output).to.equal(request.input);
    });
    
    function getAPIGatewayProxyPOSTEvent(
        bodyObject: any, 
        pathParameters: { [name: string]: string } | null = null,
    ): APIGatewayProxyEvent {

        const event = getAPIGatewayProxyEvent(pathParameters);
        
        event.httpMethod = 'POST';
        event.body = JSON.stringify(bodyObject);

        return event;
    }

    function getAPIGatewayProxyEvent(
        pathParameters: { [name: string]: string } | null = null,
        queryStringParameters: { [name: string]: string } | null = null,
    ): APIGatewayProxyEvent {

        const apiGatewayProxyEventJson = fs.readFileSync(path.join(__dirname, 'APIGatewayProxyEvent.json')).toString();

        const event = JSON.parse(apiGatewayProxyEventJson) as APIGatewayProxyEvent;

        event.pathParameters = pathParameters;
        event.queryStringParameters = queryStringParameters;

        return event;
    }
});