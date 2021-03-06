import { DocumentContentType } from '../../domain/document';

export default class RecalculationInitialiserRequest {
  contentType: DocumentContentType;
  id: string;
}
