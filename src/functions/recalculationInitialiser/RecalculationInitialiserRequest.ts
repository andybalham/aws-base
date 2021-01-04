import { DocumentType } from '../../domain/document';

export default class RecalculationInitialiserRequest {
    documentType: DocumentType;
    documentId: string;
}