import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';
import CorrelationIds from '@dazn/lambda-powertools-correlation-ids';
import { ApiGatewayFunction } from '@andybalham/agb-aws-functions';

describe('Test ApiGatewayFunction', () => {
  beforeEach('mock out dependencies', function () {});

  afterEach('restore dependencies', function () {
    ImportMock.restore();
  });

  it('POST parses, stringifies and returns OK and ids by default', async () => {
    // Arrange

    class Request {
      pathParameter: string;
      queryStringParameter: string;
      bodyParameter: string;
    }
    class Response {
      pathOutput: string;
      queryStringOutput: string;
      bodyOutput: string;
    }

    class TestApiGatewayFunction extends ApiGatewayFunction<Request, Response> {
      async handleRequestAsync(request: Request): Promise<Response> {
        return {
          pathOutput: request.pathParameter,
          queryStringOutput: request.queryStringParameter,
          bodyOutput: request.bodyParameter,
        };
      }
    }

    const body = { bodyParameter: 'bodyParameter' };
    const pathParameters = { pathParameter: 'pathParameter' };
    const queryStringParameters = { queryStringParameter: 'queryStringParameter' };

    const event = getAPIGatewayProxyPOSTEvent(body, pathParameters, queryStringParameters);

    ImportMock.mockFunction(CorrelationIds, 'get', {
      awsRequestId: 'requestId',
      'x-correlation-id': 'correlationId',
    });

    const sutTestApiGatewayFunction = new TestApiGatewayFunction({
      getCorrelationIds: CorrelationIds.get,
    });

    // Act

    const actualResult = await sutTestApiGatewayFunction.handleAsync(event);

    // Assert

    expect(actualResult).to.not.be.undefined;
    expect(actualResult.statusCode).to.equal(200);

    const actualResponse: Response = JSON.parse(actualResult.body);

    expect(actualResponse['requestId']).to.equal('requestId');
    expect(actualResponse['correlationId']).to.equal('correlationId');

    expect(actualResponse.bodyOutput).to.equal(body.bodyParameter);
    expect(actualResponse.pathOutput).to.equal(pathParameters.pathParameter);
    expect(actualResponse.queryStringOutput).to.equal(queryStringParameters.queryStringParameter);
  });

  function getAPIGatewayProxyPOSTEvent(
    bodyObject: any,
    pathParameters: { [name: string]: string } | null = null,
    queryStringParameters: { [name: string]: string } | null = null
  ): APIGatewayProxyEvent {
    //
    const event = getAPIGatewayProxyEvent(pathParameters, queryStringParameters);

    event.httpMethod = 'POST';
    event.body = JSON.stringify(bodyObject);

    return event;
  }

  function getAPIGatewayProxyEvent(
    pathParameters: { [name: string]: string } | null = null,
    queryStringParameters: { [name: string]: string } | null = null
  ): APIGatewayProxyEvent {
    const apiGatewayProxyEventJson = fs
      .readFileSync(path.join(__dirname, 'APIGatewayProxyEvent.json'))
      .toString();

    const event = JSON.parse(apiGatewayProxyEventJson) as APIGatewayProxyEvent;

    event.pathParameters = pathParameters;
    event.queryStringParameters = queryStringParameters;

    return event;
  }
});
