import { expect } from 'chai';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import * as Services from '../../src/services';
import { ProductSummary } from '../../src/domain/product';
import { DocumentContentType } from '../../src/domain/document';
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
        
        documentRepositoryMock.mock('get', {});
        const documentRepositoryPutStub = documentRepositoryMock.mock('put');

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

        expect(documentRepositoryPutStub.called).to.be.true;

        const actualResultIndex = documentRepositoryPutStub.lastCall.args[0];
        const actualResult = documentRepositoryPutStub.lastCall.args[1];

        expect(actualResultIndex.contentType).to.equal(DocumentContentType.Result);
        expect(actualResultIndex.id).to.equal(`${request.configurationId}-${request.scenarioId}-${request.productId}`);

        expect(actualResult).to.deep.equal(expectedProductSummary);
    });
});
