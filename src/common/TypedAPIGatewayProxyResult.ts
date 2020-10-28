export default class TypedAPIGatewayProxyResult<T> {

    constructor(public statusCode: HttpStatusCode, response: T) {
        this.body = JSON.stringify(response);
    }

    body: any;
}

export enum HttpStatusCode {
    OK = 200,
    Created = 200,
    Accepted = 202,
    NoContent = 204,
    BadRequest = 400,
    Unauthorised = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
}