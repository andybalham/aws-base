import { DocumentType } from '../../domain/document';

export default class UpdateDocumentResponse {
    documentType: DocumentType;
    documentId: string;
}
