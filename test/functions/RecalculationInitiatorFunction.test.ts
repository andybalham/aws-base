import { SNSMessage } from 'aws-lambda';
import { expect } from 'chai';
import { SinonStub } from 'sinon';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import { DocumentIndex, DocumentType } from '../../src/domain/document';
import * as RecalculationInitiator from '../../src/functions/recalculationInitiator';

describe('Test RecalculationInitiatorFunction', () => {

    let stepFunctionClientMock: MockManager<Common.StepFunctionClient>;

    beforeEach('mock out dependencies', function () {
        stepFunctionClientMock = ImportMock.mockClass<Common.StepFunctionClient>(Common, 'StepFunctionClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('publishes an update on INSERT', async () => {
            
        // Arrange

        const startExecutionStub: SinonStub = stepFunctionClientMock.mock('startExecution');

        const sutRecalculationInitiatorFunction = new RecalculationInitiator.Function(new Common.StepFunctionClient);

        const documentIndex: DocumentIndex = {
            documentType: DocumentType.Configuration,
            documentId: 'documentId',
            s3BucketName: 's3BucketName',
            s3Key: 's3Key',
            s3ETag: 's3ETag',
        };

        const message: SNSMessage = {
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

        // Act

        await sutRecalculationInitiatorFunction.handleMessage(message);

        // Assert

        expect(startExecutionStub.callCount).to.equal(1);

        const inputObject = startExecutionStub.lastCall.args[0];

        expect(inputObject).to.deep.equal({
            documentType: documentIndex.documentType,
            documentId: documentIndex.documentId,
        });
    });
});