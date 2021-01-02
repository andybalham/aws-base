import { SNSMessage } from 'aws-lambda';
import SQSFunction from '../../common/SQSFunction';
import StepFunctions, { StartExecutionInput } from 'aws-sdk/clients/stepfunctions';

const stepFunctions = new StepFunctions();

export default class RecalculationInitiatorFunction extends SQSFunction<SNSMessage> {

    constructor() {
        super();
    }

    async handleMessage(message: SNSMessage): Promise<void> {
        
        const documentIndexJson = message.Message;    
        const recalculationStateMachineArn = process.env.RECALCULATION_STATE_MACHINE_ARN ?? 'undefined';

        const params: StartExecutionInput = {
            stateMachineArn: recalculationStateMachineArn,
            input: documentIndexJson
        };
    
        stepFunctions.startExecution(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });        
    }
}
