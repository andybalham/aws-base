import { DocumentType } from '../../domain/document';

export default class RecalculationInitiatorRequest {
    documentType: DocumentType;
    documentId: string;
}