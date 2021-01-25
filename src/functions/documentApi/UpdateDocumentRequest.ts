import { DocumentContentType } from '../../domain/document';
import { Configuration } from '../../domain/configuration';
import { Application } from '../../domain/input';
import { Product } from '../../domain/product';

export default class UpdateDocumentRequest {
    id?: string
    contentType: DocumentContentType
    description: string
    content: Application | Configuration | Product
}
