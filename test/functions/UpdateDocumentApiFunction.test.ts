import * as DocumentApi from '../../src/functions/documentApi';
import * as Services from '../../src/services';
import * as Common from '../../src/common';
import { expect } from 'chai';
import { DocumentContentType } from '../../src/domain/document';
import { ImportMock, MockManager } from 'ts-mock-imports';
import { SinonStub } from 'sinon';

describe('Test UpdateDocumentApiFunction', () => {

    let documentRepositoryMock: MockManager<Services.DocumentRepository>;

    beforeEach('mock out dependencies', function () {
        documentRepositoryMock = ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
    
    it.only('passes through the request details', async () => {
       
        // Arrange

        const request: DocumentApi.UpdateRequest = {
            id: 'requestId',
            description: 'Expected description',
            contentType: DocumentContentType.Scenario,
            content: {
                applicants: []
            }
        };

        const documentRepository = 
            new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());

        const documentRepositoryPutStub: SinonStub = documentRepositoryMock.mock('put', request.id);
    
        const sutDocumentUpdateApiFunction = new DocumentApi.UpdateFunction(documentRepository);

        // Act

        const response = await sutDocumentUpdateApiFunction.handleRequest(request);

        // Assert

        expect(response.id).to.equal(request.id);

        expect(documentRepositoryPutStub.callCount).to.equal(1);

        const actualIndex = documentRepositoryPutStub.firstCall.args[0];
        const actualContent = documentRepositoryPutStub.firstCall.args[1];

        expect(actualIndex).to.deep.equal({
            id: request.id,
            contentType: request.contentType,
            description: request.description            
        });

        expect(actualContent).to.deep.equal(request.content);
    });    
});