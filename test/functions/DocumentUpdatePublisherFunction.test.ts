import { expect } from 'chai';
import { SinonStub } from 'sinon';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as Common from '../../src/common';
import { DocumentContentIndex, DocumentContentType } from '../../src/domain/document';
import * as DocumentIndexUpdatePublisher from '../../src/functions/documentIndexUpdatePublisher';

describe('Test DocumentUpdatePublisherFunction', () => {

    let snsClientMock: MockManager<Common.SNSClient>;

    beforeEach('mock out dependencies', function () {
        snsClientMock = ImportMock.mockClass<Common.SNSClient>(Common, 'SNSClient');
    });
    
    afterEach('restore dependencies', function () {
        ImportMock.restore();
    });

    it('publishes an update on INSERT', async () => {
            
        // Arrange

        const publishMessageStub: SinonStub = snsClientMock.mock('publishMessage');

        const sutDocumentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(new Common.SNSClient);

        const newImage: DocumentContentIndex = {
            id: 'C-documentId',
            contentType: DocumentContentType.Configuration,
            s3BucketName: 's3BucketName',
            s3ETag: 's3ETag',
            s3Key: 's3Key',
        };

        // Act

        await sutDocumentIndexUpdatePublisherFunction.processEventRecord('INSERT', undefined, newImage);

        // Assert

        expect(publishMessageStub.callCount).to.equal(1);

        const publishedImage = publishMessageStub.lastCall.args[0];
        expect(publishedImage).to.deep.equal(newImage);

        const publishedAttributes = publishMessageStub.lastCall.args[1];
        expect(publishedAttributes).to.deep.equal({contentType:newImage.contentType});
    });

    it('publishes an update on MODIFY when ETag has changed', async () => {
        
        // Arrange

        const publishMessageStub: SinonStub = snsClientMock.mock('publishMessage');

        const sutDocumentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(new Common.SNSClient);

        const Image: DocumentContentIndex = {
            id: 'C-documentId',
            contentType:DocumentContentType.Configuration,
            s3BucketName: 's3BucketName',
            s3ETag: 's3ETag',
            s3Key: 's3Key',
        };

        const newImage: DocumentContentIndex = {
            id: 'C-documentIdNew',
            contentType:DocumentContentType.Configuration,
            s3BucketName: 's3BucketNameNew',
            s3ETag: 's3ETagNew',
            s3Key: 's3KeyNew',
        };

        // Act

        await sutDocumentIndexUpdatePublisherFunction.processEventRecord('MODIFY', Image, newImage);

        // Assert

        expect(publishMessageStub.callCount).to.equal(1);

        const publishedImage = publishMessageStub.lastCall.args[0];
        expect(publishedImage).to.deep.equal(newImage);

        const publishedAttributes = publishMessageStub.lastCall.args[1];
        expect(publishedAttributes).to.deep.equal({contentType:newImage.contentType});
    });    

    it('does not publish an update on MODIFY when ETag has not changed', async () => {
        
        // Arrange

        const publishMessageStub: SinonStub = snsClientMock.mock('publishMessage');

        const sutDocumentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(new Common.SNSClient);

        const image: DocumentContentIndex = {
            id: 'C-documentId',
            contentType:DocumentContentType.Configuration,
            s3BucketName: 's3BucketName',
            s3ETag: 's3ETag',
            s3Key: 's3Key',
        };

        // Act

        await sutDocumentIndexUpdatePublisherFunction.processEventRecord('MODIFY', image, image);

        // Assert

        expect(publishMessageStub.callCount).to.equal(0);
    });    

    it('does not publish an update on REMOVE', async () => {
        
        // Arrange

        const publishMessageStub: SinonStub = snsClientMock.mock('publishMessage');

        const sutDocumentIndexUpdatePublisherFunction = new DocumentIndexUpdatePublisher.Function(new Common.SNSClient);

        const oldImage: DocumentContentIndex = {
            id: 'C-documentId',
            contentType:DocumentContentType.Configuration,
            s3BucketName: 's3BucketName',
            s3ETag: 's3ETag',
            s3Key: 's3Key',
        };

        // Act

        await sutDocumentIndexUpdatePublisherFunction.processEventRecord('REMOVE', oldImage, undefined);

        // Assert

        expect(publishMessageStub.callCount).to.equal(0);
    });    
});