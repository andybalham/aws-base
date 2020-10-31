import CorrelationIds from '@dazn/lambda-powertools-correlation-ids';

export default class HttpContextIds {

    private static _correlationIds: any;

    private static get correlationIds(): any {
        this._correlationIds = this._correlationIds ?? CorrelationIds.get();
        return this._correlationIds; 
    }
    static get correlationId(): string {
        return this.correlationIds['x-correlation-id'];
    }

    static get requestId(): string {
        return this.correlationIds.awsRequestId;
    }

}