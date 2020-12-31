import { DocumentType } from '../../domain/document';
import { ClientConfiguration } from '../../domain/configuration';
import { Application } from '../../domain/input';
import { Product } from '../../domain/product';

export default class UpdateDocumentRequest {
    type: DocumentType
    id?: string
    description?: string
    content: Application | ClientConfiguration | Product
}
