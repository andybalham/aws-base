import * as ScenarioApi from '../../src/functions/scenarioApi';
import * as Services from '../../src/services';
import * as Common from '../../src/common';
import { expect } from 'chai';
import { DocumentMetadata, DocumentType } from '../../src/domain/document';
import { ImportMock, MockManager } from 'ts-mock-imports';
import { SinonStub } from 'sinon';

describe('Test UpdateScenarioApiFunction', () => {

    let documentRepositoryMock: MockManager<Services.DocumentRepository>;

    beforeEach('mock out dependencies', function () {
        documentRepositoryMock = ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });
    
    it('generates a new id', async () => {
       
        // Arrange

        const request: ScenarioApi.UpdateRequest = {
            description: 'Expected description',
            application: {
                applicants: []
            }
        };

        const documentRepository = 
            new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());

        const putContentStub: SinonStub = documentRepositoryMock.mock('putContent');
    
        const sutScenarioUpdateApiFunction = new ScenarioApi.UpdateFunction(documentRepository);

        // Act

        const response = await sutScenarioUpdateApiFunction.handleRequest(request);

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

        expect(actualContent).to.deep.equal(request.application);
    });    
    
    it('preserves a given id', async () => {
       
        // Arrange

        const request: ScenarioApi.UpdateRequest = {
            id: 'ExpectedID',
            description: 'Expected description',
            application: {
                applicants: []
            }
        };

        const documentRepository = 
            new Services.DocumentRepository(new Common.S3Client(), new Common.DynamoDBClient());

        const putContentStub: SinonStub = documentRepositoryMock.mock('putContent');
    
        const sutScenarioUpdateApiFunction = new ScenarioApi.UpdateFunction(documentRepository);

        // Act

        const response = await sutScenarioUpdateApiFunction.handleRequest(request);

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

        expect(actualContent).to.deep.equal(request.application);
    });    
});