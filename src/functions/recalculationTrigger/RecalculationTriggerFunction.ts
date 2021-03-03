import { SNSMessage } from 'aws-lambda';
import { SQSFunction } from '../../common';
import { StepFunctionsClient } from '@andybalham/agb-aws-clients';
import { DocumentIndex} from '../../domain/document';
import RecalculationInitialiserRequest from '../recalculationInitialiser/RecalculationInitialiserRequest';

export default class RecalculationTriggerFunction extends SQSFunction<SNSMessage> {

    constructor(private recalculationStepFunctionsClient: StepFunctionsClient) {
        super();
    }

    async handleMessageAsync(message: SNSMessage): Promise<void> {
        
        const index: DocumentIndex = JSON.parse(message.Message);

        const recalculationInitialiserRequest: RecalculationInitialiserRequest = {
            contentType: index.contentType,
            id: index.id,
        };
        
        await this.recalculationStepFunctionsClient.startExecutionAsync(recalculationInitialiserRequest);
    }
}
