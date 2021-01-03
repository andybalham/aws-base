import { SNSMessage } from 'aws-lambda';
import chai from 'chai';
import { expect } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import { SinonStub } from 'sinon';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import * as Services from '../../src/services';
import { DocumentIndex, DocumentType } from '../../src/domain/document';
import * as RecalculationInitiator from '../../src/functions/recalculationInitiator';
import * as Recalculator from '../../src/functions/recalculator';

chai.use(deepEqualInAnyOrder);

describe('Test RecalculationInitiatorFunction', () => {

    let stepFunctionClientMock: MockManager<Common.StepFunctionClient>;
    let documentRepositoryMock: MockManager<Services.DocumentRepository>;

    beforeEach('mock out dependencies', function () {

        stepFunctionClientMock = ImportMock.mockClass<Common.StepFunctionClient>(Common, 'StepFunctionClient');
        
        documentRepositoryMock = ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');

        documentRepositoryMock.mock('listConfigurations', [
            getDocumentIndex(DocumentType.Configuration, 'configurationId'),
        ]);

        documentRepositoryMock.mock('listScenarios', [
            getDocumentIndex(DocumentType.Scenario, 'scenarioIdX'),
            getDocumentIndex(DocumentType.Scenario, 'scenarioIdY'),
        ]);

        documentRepositoryMock.mock('listProducts', [
            getDocumentIndex(DocumentType.Product, 'productIdX'),
            getDocumentIndex(DocumentType.Product, 'productIdY'),
        ]);
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('starts execution for a change of configuration', async () => {
            
        // Arrange

        const documentRepository = new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());
        
        const documentIndex = getDocumentIndex(DocumentType.Configuration, 'configurationId');

        const message: SNSMessage = getSNSMessage(documentIndex);

        const startExecutionStub: SinonStub = stepFunctionClientMock.mock('startExecution');

        const sutRecalculationInitiatorFunction = 
            new RecalculationInitiator.Function(documentRepository, new Common.StepFunctionClient());

        // Act

        await sutRecalculationInitiatorFunction.handleMessage(message);

        // Assert

        expect(startExecutionStub.callCount).to.equal(1);

        const actualInputObject = startExecutionStub.lastCall.args[0];

        const expectedInputObject: Recalculator.Request[] = [
            { configurationId: 'configurationId', scenarioId: 'scenarioIdX', productId: 'productIdX' },
            { configurationId: 'configurationId', scenarioId: 'scenarioIdX', productId: 'productIdY' },
            { configurationId: 'configurationId', scenarioId: 'scenarioIdY', productId: 'productIdX' },
            { configurationId: 'configurationId', scenarioId: 'scenarioIdY', productId: 'productIdY' },
        ];
        
        expect(actualInputObject).to.deep.equalInAnyOrder(expectedInputObject);
    });

    it('starts execution for a change of scenario', async () => {
            
        // Arrange

        const documentRepository = new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());
        
        const documentIndex = getDocumentIndex(DocumentType.Scenario, 'scenarioId');

        const message: SNSMessage = getSNSMessage(documentIndex);

        const startExecutionStub: SinonStub = stepFunctionClientMock.mock('startExecution');

        const sutRecalculationInitiatorFunction = 
            new RecalculationInitiator.Function(documentRepository, new Common.StepFunctionClient());

        // Act

        await sutRecalculationInitiatorFunction.handleMessage(message);

        // Assert

        expect(startExecutionStub.callCount).to.equal(1);

        const actualInputObject = startExecutionStub.lastCall.args[0];

        const expectedInputObject: Recalculator.Request[] = [
            { configurationId: 'configurationId', scenarioId: 'scenarioId', productId: 'productIdX' },
            { configurationId: 'configurationId', scenarioId: 'scenarioId', productId: 'productIdY' },
        ];
        
        expect(actualInputObject).to.deep.equalInAnyOrder(expectedInputObject);
    });

    it('starts execution for a change of product', async () => {
            
        // Arrange

        const documentRepository = new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());
        
        const documentIndex = getDocumentIndex(DocumentType.Product, 'productId');

        const message: SNSMessage = getSNSMessage(documentIndex);

        const startExecutionStub: SinonStub = stepFunctionClientMock.mock('startExecution');

        const sutRecalculationInitiatorFunction = 
            new RecalculationInitiator.Function(documentRepository, new Common.StepFunctionClient());

        // Act

        await sutRecalculationInitiatorFunction.handleMessage(message);

        // Assert

        expect(startExecutionStub.callCount).to.equal(1);

        const actualInputObject = startExecutionStub.lastCall.args[0];

        const expectedInputObject: Recalculator.Request[] = [
            { configurationId: 'configurationId', scenarioId: 'scenarioIdX', productId: 'productId' },
            { configurationId: 'configurationId', scenarioId: 'scenarioIdY', productId: 'productId' },
        ];
        
        expect(actualInputObject).to.deep.equalInAnyOrder(expectedInputObject);
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
        documentType: documentType,
        documentId: documentId,
        s3BucketName: 's3BucketName',
        s3Key: 's3Key',
        s3ETag: 's3ETag',
    };
}
