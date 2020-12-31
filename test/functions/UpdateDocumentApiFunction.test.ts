import * as DocumentApi from '../../src/functions/documentApi';
import * as Services from '../../src/services';
import * as Common from '../../src/common';
import { expect } from 'chai';
import { DocumentMetadata, DocumentType } from '../../src/domain/document';
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
    
    it('generates a new id', async () => {
       
        // Arrange

        const request: DocumentApi.UpdateRequest = {
            type: DocumentType.Scenario,
            description: 'Expected description',
            content: {
                applicants: []
            }
        };

        const documentRepository = 
            new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());

        const putContentStub: SinonStub = documentRepositoryMock.mock('putContent');
    
        const sutDocumentUpdateApiFunction = new DocumentApi.UpdateFunction(documentRepository);

        // Act

        const response = await sutDocumentUpdateApiFunction.handleRequest(request);

        // Assert

        expect(response.documentType).to.equal(DocumentType.Scenario);
        expect(response.documentId).to.not.equal(request.id);

        expect(putContentStub.callCount).to.equal(1);

        const actualMetadata: DocumentMetadata = putContentStub.firstCall.args[0];
        const actualContent = putContentStub.firstCall.args[1];

        expect(actualMetadata).to.deep.equal({
            id: response.documentId,
            type: DocumentType.Scenario,
            description: request.description            
        });

        expect(actualContent).to.deep.equal(request.content);
    });    
    
    it('preserves a given id', async () => {
       
        // Arrange

        const request: DocumentApi.UpdateRequest = {
            id: 'ExpectedID',
            type: DocumentType.Scenario,
            description: 'Expected description',
            content: {
                applicants: []
            }
        };

        const documentRepository = 
            new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());

        const putContentStub: SinonStub = documentRepositoryMock.mock('putContent');
    
        const sutDocumentUpdateApiFunction = new DocumentApi.UpdateFunction(documentRepository);

        // Act

        const response = await sutDocumentUpdateApiFunction.handleRequest(request);

        // Assert

        expect(response.documentType).to.equal(DocumentType.Scenario);
        expect(response.documentId).to.equal(request.id);

        expect(putContentStub.callCount).to.equal(1);

        const actualMetadata: DocumentMetadata = putContentStub.firstCall.args[0];
        const actualContent = putContentStub.firstCall.args[1];

        expect(actualMetadata).to.deep.equal({
            id: response.documentId,
            type: DocumentType.Scenario,
            description: request.description            
        });

        expect(actualContent).to.deep.equal(request.content);
    });    
});