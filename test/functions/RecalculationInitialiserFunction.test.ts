import chai from 'chai';
import { expect } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import * as Services from '../../src/services';
import { DocumentIndex, DocumentType } from '../../src/domain/document';
import * as RecalculationInitialiser from '../../src/functions/recalculationInitialiser';

chai.use(deepEqualInAnyOrder);

describe('Test RecalculationInitialiserFunction', () => {

    let documentRepositoryMock: MockManager<Services.DocumentRepository>;

    beforeEach('mock out dependencies', function () {

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
        
        const request: RecalculationInitialiser.Request = {
            documentType: DocumentType.Configuration,
            documentId: 'configurationId',
        };

        const sutRecalculationInitialiserFunction = new RecalculationInitialiser.Function(documentRepository);

        // Act

        const actualResponse = await sutRecalculationInitialiserFunction.handleRequest(request);

        // Assert

        const expectedResponse: RecalculationInitialiser.Response = [
            { configurationId: 'configurationId', scenarioId: 'scenarioIdX', productId: 'productIdX' },
            { configurationId: 'configurationId', scenarioId: 'scenarioIdX', productId: 'productIdY' },
            { configurationId: 'configurationId', scenarioId: 'scenarioIdY', productId: 'productIdX' },
            { configurationId: 'configurationId', scenarioId: 'scenarioIdY', productId: 'productIdY' },
        ];
        
        expect(actualResponse).to.deep.equalInAnyOrder(expectedResponse);
    });

    it('starts execution for a change of scenario', async () => {
            
        // Arrange

        const documentRepository = new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());
        
        const request: RecalculationInitialiser.Request = {
            documentType: DocumentType.Scenario,
            documentId: 'scenarioId',
        };

        const sutRecalculationInitialiserFunction = new RecalculationInitialiser.Function(documentRepository);

        // Act

        const actualResponse = await sutRecalculationInitialiserFunction.handleRequest(request);

        // Assert

        const expectedResponse: RecalculationInitialiser.Response = [
            { configurationId: 'configurationId', scenarioId: 'scenarioId', productId: 'productIdX' },
            { configurationId: 'configurationId', scenarioId: 'scenarioId', productId: 'productIdY' },
        ];
        
        expect(actualResponse).to.deep.equalInAnyOrder(expectedResponse);
    });

    it('starts execution for a change of product', async () => {
            
        // Arrange

        const documentRepository = new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());
        
        const request: RecalculationInitialiser.Request = {
            documentType: DocumentType.Product,
            documentId: 'productId',
        };

        const sutRecalculationInitialiserFunction = new RecalculationInitialiser.Function(documentRepository);

        // Act

        const actualResponse = await sutRecalculationInitialiserFunction.handleRequest(request);

        // Assert

        const expectedResponse: RecalculationInitialiser.Response = [
            { configurationId: 'configurationId', scenarioId: 'scenarioIdX', productId: 'productId' },
            { configurationId: 'configurationId', scenarioId: 'scenarioIdY', productId: 'productId' },
        ];
        
        expect(actualResponse).to.deep.equalInAnyOrder(expectedResponse);
    });
});

function getDocumentIndex(documentType: DocumentType, documentId: string): DocumentIndex {
    return {
        documentType: documentType,
        documentId: documentId,
        s3BucketName: 's3BucketName',
        s3Key: 's3Key',
        s3ETag: 's3ETag',
    };
}
