import { SNSMessage } from 'aws-lambda';
import { SQSFunction, StepFunctionClient } from '../../common';
import { DocumentIndex } from '../../domain/document';

export default class RecalculationInitiatorFunction extends SQSFunction<SNSMessage> {

    constructor(private recalculationStepFunctionClient: StepFunctionClient) {
        super();
    }

    async handleMessage(message: SNSMessage): Promise<void> {
        
        const documentIndex: DocumentIndex = JSON.parse(message.Message);

        await this.recalculationStepFunctionClient
            .startExecution({
                documentType: documentIndex.documentType,
                documentId: documentIndex.documentId,
            });
    }
}
