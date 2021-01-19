import { SNSMessage } from 'aws-lambda';
import { expect } from 'chai';
import { SinonStub } from 'sinon';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import * as RecalculationTrigger from '../../src/functions/recalculationTrigger';
import * as RecalculationInitialiser from '../../src/functions/recalculationInitialiser';
import { DocumentContentIndex, DocumentContentType } from '../../src/domain/document';

describe('Test RecalculationTriggerFunction', () => {

    let stepFunctionClientMock: MockManager<Common.StepFunctionClient>;

    beforeEach('mock out dependencies', function () {
        stepFunctionClientMock = ImportMock.mockClass<Common.StepFunctionClient>(Common, 'StepFunctionClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('starts execution for a change of configuration', async () => {
            
        // Arrange

        const documentContentIndex = getDocumentIndex(DocumentContentType.Configuration, 'configurationId');

        const message: SNSMessage = getSNSMessage(documentContentIndex);

        const startExecutionStub: SinonStub = stepFunctionClientMock.mock('startExecution');

        const sutRecalculationTriggerFunction = 
            new RecalculationTrigger.Function(new Common.StepFunctionClient());

        // Act

        await sutRecalculationTriggerFunction.handleMessage(message);

        // Assert

        expect(startExecutionStub.callCount).to.equal(1);

        const actualInputObject = startExecutionStub.lastCall.args[0];

        const expectedInputObject: RecalculationInitialiser.Request = {
            contentType: documentContentIndex.contentType,
            id: documentContentIndex.id,
        };
        
        expect(actualInputObject).to.deep.equal(expectedInputObject);
    });
});

function getSNSMessage(DocumentContentIndex: DocumentContentIndex): SNSMessage {
    return {
        Message: JSON.stringify(DocumentContentIndex),
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

function getDocumentIndex(contentType: DocumentContentType, id: string): DocumentContentIndex {
    return {
        id,
        contentType,
        s3BucketName: 's3BucketName',
        s3Key: 's3Key',
        s3ETag: 's3ETag',
    };
}
