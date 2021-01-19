import { SNSMessage } from 'aws-lambda';
import { SQSFunction, StepFunctionClient } from '../../common';
import { DocumentContentIndex} from '../../domain/document';
import RecalculationInitialiserRequest from '../recalculationInitialiser/RecalculationInitialiserRequest';

export default class RecalculationTriggerFunction extends SQSFunction<SNSMessage> {

    constructor(private recalculationStepFunctionClient: StepFunctionClient) {
        super();
    }

    async handleMessage(message: SNSMessage): Promise<void> {
        
        const documentContentIndex: DocumentContentIndex = JSON.parse(message.Message);

        const recalculationInitialiserRequest: RecalculationInitialiserRequest = {
            contentType: documentContentIndex.contentType,
            id: documentContentIndex.id,
        };
        
        await this.recalculationStepFunctionClient.startExecution(recalculationInitialiserRequest);
    }
}
