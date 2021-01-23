import { expect } from 'chai';
import { SinonStub } from 'sinon';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import * as Services from '../../src/services';
import { DocumentIndex, DocumentContentType } from '../../src/domain/document';
import * as DocumentIndexUpdatePublisher from '../../src/functions/documentIndexUpdatePublisher';

describe('Test DocumentUpdatePublisherFunction', () => {

    let documentRepositoryMock: MockManager<Services.DocumentRepository>;
    let snsClientMock: MockManager<Common.SNSClient>;

    beforeEach('mock out dependencies', function () {
        documentRepositoryMock = ImportMock.mockClass<Services.DocumentRepository>(Services, 'DocumentRepository');
        snsClientMock = ImportMock.mockClass<Common.SNSClient>(Common, 'SNSClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('publishes an update on INSERT', async () => {
            
        // Arrange

        const oldImage = undefined;

        const newImage = 
            Common.DynamoDBSingleTableItem.getItem({
                s3BucketName: 's3BucketName',
                s3Key: 's3Key',
                hash: 'hash',
            }, 'hash', 's3BucketName', 's3Key');

        const index: DocumentIndex = {
            id: 'C-documentId',
            contentType: DocumentContentType.Configuration,
            s3BucketName: 's3BucketName',
            s3Key: 's3Key',
        };

        documentRepositoryMock.mock('getIndexByS3Async', index);

        const publishMessageStub: SinonStub = snsClientMock.mock('publishMessageAsync');

        // Act

        const sutDocumentIndexUpdatePublisherFunction = 
            new DocumentIndexUpdatePublisher.Function(
                new Services.DocumentRepository(
                    new Common.S3Client(), 
                    new Common.DynamoDBSingleTableClient()
                ), 
                new Common.SNSClient
            );

        await sutDocumentIndexUpdatePublisherFunction.processEventRecord('INSERT', oldImage, newImage);

        // Assert

        expect(publishMessageStub.callCount).to.equal(1);

        const publishedImage = publishMessageStub.lastCall.args[0];
        expect(publishedImage).to.deep.equal(index);

        const publishedAttributes = publishMessageStub.lastCall.args[1];
        expect(publishedAttributes).to.deep.equal({ contentType: index.contentType });
    });

    it('publishes an update on MODIFY when ETag has changed', async () => {
        
        // // Arrange

        // const publishMessageStub: SinonStub = snsClientMock.mock('publishMessage');

        // const sutDocumentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(new Common.SNSClient);

        // const Image: DocumentIndex = {
        //     id: 'C-documentId',
        //     contentType:DocumentContentType.Configuration,
        //     s3BucketName: 's3BucketName',
        //     s3ETag: 's3ETag',
        //     s3Key: 's3Key',
        // };

        // const newImage: DocumentIndex = {
        //     id: 'C-documentIdNew',
        //     contentType:DocumentContentType.Configuration,
        //     s3BucketName: 's3BucketNameNew',
        //     s3ETag: 's3ETagNew',
        //     s3Key: 's3KeyNew',
        // };

        // // Act

        // await sutDocumentIndexUpdatePublisherFunction.processEventRecord('MODIFY', Image, newImage);

        // // Assert

        // expect(publishMessageStub.callCount).to.equal(1);

        // const publishedImage = publishMessageStub.lastCall.args[0];
        // expect(publishedImage).to.deep.equal(newImage);

        // const publishedAttributes = publishMessageStub.lastCall.args[1];
        // expect(publishedAttributes).to.deep.equal({ contentType: newImage.contentType });
    });    

    it('does not publish an update on MODIFY when ETag has not changed', async () => {
        
        // // Arrange

        // const publishMessageStub: SinonStub = snsClientMock.mock('publishMessage');

        // const sutDocumentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(new Common.SNSClient);

        // const image: DocumentIndex = {
        //     id: 'C-documentId',
        //     contentType:DocumentContentType.Configuration,
        //     s3BucketName: 's3BucketName',
        //     s3ETag: 's3ETag',
        //     s3Key: 's3Key',
        // };

        // // Act

        // await sutDocumentIndexUpdatePublisherFunction.processEventRecord('MODIFY', image, image);

        // // Assert

        // expect(publishMessageStub.callCount).to.equal(0);
    });    

    it('does not publish an update on REMOVE', async () => {
        
        //     // Arrange

        //     const publishMessageStub: SinonStub = snsClientMock.mock('publishMessage');

        //     const sutDocumentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(new Common.SNSClient);

        //     const oldImage: DocumentIndex = {
        //         id: 'C-documentId',
        //         contentType:DocumentContentType.Configuration,
        //         s3BucketName: 's3BucketName',
        //         s3ETag: 's3ETag',
        //         s3Key: 's3Key',
        //     };

        //     // Act

        //     await sutDocumentIndexUpdatePublisherFunction.processEventRecord('REMOVE', oldImage, undefined);

        //     // Assert

    //     expect(publishMessageStub.callCount).to.equal(0);
    });    
});