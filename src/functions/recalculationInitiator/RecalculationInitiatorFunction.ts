import { SNSEvent } from 'aws-lambda';
import SNSFunction from '../../common/SNSFunction';
import SQSFunction from '../../common/SQSFunction';
import { DocumentIndex } from '../../domain/document';

export default class RecalculationInitiatorFunction extends SQSFunction<SNSEvent> {

    private readonly snsHandler: SNSHandler;

    constructor() {
        super();
        this.snsHandler = new SNSHandler();
    }

    async handleMessage(message: SNSEvent): Promise<void> {
        await this.snsHandler.handle(message, this.context);
    }
}

class SNSHandler extends SNSFunction<DocumentIndex> {

    async handleMessage(message: DocumentIndex): Promise<void> {
        console.log(`message: ${JSON.stringify(message)}`);
    }
}