import Log from '@dazn/lambda-powertools-logger';
import StepFunctions, { StartExecutionInput } from 'aws-sdk/clients/stepfunctions';
import https from 'https';

const agent = new https.Agent({
    keepAlive: true
});

const stepFunctions = new StepFunctions({
    httpOptions: {
        agent
    }
});

export default class StepFunctionClient {

    private stepFunctions: StepFunctions;

    constructor(private stateMachineArn?: string, stepFunctionsOverride?: StepFunctions) {
        this.stepFunctions = stepFunctionsOverride ?? stepFunctions;
    }

    async startExecution(inputObject: object): Promise<void> {
        
        if (this.stateMachineArn === undefined) throw new Error('this.stateMachineArn === undefined');

        const params: StartExecutionInput = {
            stateMachineArn: this.stateMachineArn,
            input: JSON.stringify(inputObject),
        };
    
        Log.debug('startExecution', {params});

        await this.stepFunctions.startExecution(params).promise();
    }
}