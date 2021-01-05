import { expect } from 'chai';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import * as Services from '../../src/services';
import { ProductSummary } from '../../src/domain/product';
import { DocumentMetadata, DocumentType } from '../../src/domain/document';
import * as Recalculator from '../../src/functions/recalculator';

describe('Test RecalculatorFunction', () => {

    let documentRepositoryMock: MockManager<Services.DocumentRepository>;
    let productEngineMock: MockManager<Services.ProductEngine>;

    beforeEach('mock out dependencies', function () {
        documentRepositoryMock = ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');
        productEngineMock = ImportMock.mockClass<Services.ProductEngine>(Services, 'ProductEngine');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('starts execution for a change of configuration', async () => {
            
        // Arrange
        
        documentRepositoryMock.mock('getConfiguration', {});
        documentRepositoryMock.mock('getScenario', {});
        documentRepositoryMock.mock('getProduct', {});        
        const documentRepositoryPutContentStub = documentRepositoryMock.mock('putContent');

        const expectedProductSummary: ProductSummary = 
            {
                maximumLoanAmount: 666,
                product: {
                    incomeMultiplier: 0,
                    interestRate: 0,
                    productDescription: '',
                    productIdentifier: '',
                }
            };

        const productEngineCalculateProductSummariesStub = 
            productEngineMock.mock('calculateProductSummaries', [expectedProductSummary]);

        const request: Recalculator.Request = {
            configurationId: 'configurationId',
            scenarioId: 'scenarioId',
            productId: 'productId',
        };

        const sutRecalculatorFunction = 
            new Recalculator.Function(
                new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient()),
                new Services.ProductEngine(),
            );

        // Act

        await sutRecalculatorFunction.handleRequest(request);

        // Assert

        expect(productEngineCalculateProductSummariesStub.called).to.be.true;

        expect(documentRepositoryPutContentStub.called).to.be.true;

        const actualResultMetadata: DocumentMetadata = documentRepositoryPutContentStub.lastCall.args[0];
        const actualResult = documentRepositoryPutContentStub.lastCall.args[1];

        expect(actualResultMetadata.type).to.equal(DocumentType.Result);
        expect(actualResultMetadata.id).to.equal(`${request.configurationId}-${request.scenarioId}-${request.productId}`);

        expect(actualResult).to.deep.equal(expectedProductSummary);
    });
});
