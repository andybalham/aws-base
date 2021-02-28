import { SNSMessage } from 'aws-lambda';
import { expect } from 'chai';
import { SinonStub } from 'sinon';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as AwsClients from '@andybalham/agb-aws-clients';
import * as RecalculationTrigger from '../../src/functions/recalculationTrigger';
import * as RecalculationInitialiser from '../../src/functions/recalculationInitialiser';
import { DocumentIndex, DocumentContentType } from '../../src/domain/document';

describe('Test RecalculationTriggerFunction', () => {

    let stepFunctionClientMock: MockManager<AwsClients.StepFunctionClient>;

    beforeEach('mock out dependencies', function () {
        stepFunctionClientMock = ImportMock.mockClass<AwsClients.StepFunctionClient>(AwsClients, 'StepFunctionClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('starts execution for a change of configuration', async () => {
            
        // Arrange

        const DocumentIndex = getDocumentIndex(DocumentContentType.Configuration, 'configurationId');

        const message: SNSMessage = getSNSMessage(DocumentIndex);

        const startExecutionStub: SinonStub = stepFunctionClientMock.mock('startExecutionAsync');

        const sutRecalculationTriggerFunction = 
            new RecalculationTrigger.Function(new AwsClients.StepFunctionClient());

        // Act

        await sutRecalculationTriggerFunction.handleMessageAsync(message);

        // Assert

        expect(startExecutionStub.callCount).to.equal(1);

        const actualInputObject = startExecutionStub.lastCall.args[0];

        const expectedInputObject: RecalculationInitialiser.Request = {
            contentType: DocumentIndex.contentType,
            id: DocumentIndex.id,
        };
        
        expect(actualInputObject).to.deep.equal(expectedInputObject);
    });
});

function getSNSMessage(DocumentIndex: DocumentIndex): SNSMessage {
    return {
        Message: JSON.stringify(DocumentIndex),
        SignatureVersion: 'string',
        Timestamp: 'string',
        Signature: 'string',
        SigningCertUrl: 'string',
        MessageId: 'string',
        MessageAttributes: {},
        Type: 'string',
        UnsubscribeUrl: 'string',
        TopicArn: 'string',
        Subject: 'string',
    };
}

function getDocumentIndex(contentType: DocumentContentType, id: string): DocumentIndex {
    return {
        id,
        contentType,
        s3BucketName: 's3BucketName',
        s3Key: 's3Key',
        description: 'description',
    };
}
