import { SNSMessage } from 'aws-lambda';
import { SQSFunction, StepFunctionClient } from '../../common';
import { DocumentIndex} from '../../domain/document';
import RecalculationInitiatorRequest from '../recalculationInitiator/RecalculationInitiatorRequest';

export default class RecalculationTriggerFunction extends SQSFunction<SNSMessage> {

    constructor(private recalculationStepFunctionClient: StepFunctionClient) {
        super();
    }

    async handleMessage(message: SNSMessage): Promise<void> {
        
        const documentIndex: DocumentIndex = JSON.parse(message.Message);

        const recalculationInitiatorRequest: RecalculationInitiatorRequest = {
            documentType: documentIndex.documentType,
            documentId: documentIndex.documentId,
        };
        
        await this.recalculationStepFunctionClient.startExecution(recalculationInitiatorRequest);
    }
}
