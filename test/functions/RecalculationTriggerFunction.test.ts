import { SNSMessage } from 'aws-lambda';
import { expect } from 'chai';
import { SinonStub } from 'sinon';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import * as RecalculationTrigger from '../../src/functions/recalculationTrigger';
import * as RecalculationInitialiser from '../../src/functions/recalculationInitialiser';
import { DocumentIndex, DocumentType } from '../../src/domain/document';

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

        const documentIndex = getDocumentIndex(DocumentType.Configuration, 'configurationId');

        const message: SNSMessage = getSNSMessage(documentIndex);

        const startExecutionStub: SinonStub = stepFunctionClientMock.mock('startExecution');

        const sutRecalculationTriggerFunction = 
            new RecalculationTrigger.Function(new Common.StepFunctionClient());

        // Act

        await sutRecalculationTriggerFunction.handleMessage(message);

        // Assert

        expect(startExecutionStub.callCount).to.equal(1);

        const actualInputObject = startExecutionStub.lastCall.args[0];

        const expectedInputObject: RecalculationInitialiser.Request = {
            documentType: documentIndex.documentType,
            documentId: documentIndex.documentId,
        };
        
        expect(actualInputObject).to.deep.equal(expectedInputObject);
    });
});

function getSNSMessage(documentIndex: DocumentIndex): SNSMessage {
    return {
        Message: JSON.stringify(documentIndex),
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

function getDocumentIndex(documentType: DocumentType, documentId: string): DocumentIndex {
    return {
        id: `${documentType}-${documentId}`,
        documentType,
        documentId,
        s3BucketName: 's3BucketName',
        s3Key: 's3Key',
        s3ETag: 's3ETag',
    };
}
