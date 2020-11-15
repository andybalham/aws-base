import S3 from 'aws-sdk/clients/s3';
import S3Client from '../common/S3Client';

import { ClientConfiguration } from '../domain/configuration';

export default class ConfigurationRepositoryClient {
    
    private s3Client: S3Client;

    constructor(s3?: S3, fileBucket?: string) {
        this.s3Client = new S3Client(s3, fileBucket);
    }

    async getClientConfiguration(): Promise<ClientConfiguration> {
        const fileKey = 'configuration/configuration_client.json';
        const clientConfiguration = await this.s3Client.getParsedObject<ClientConfiguration>(fileKey);
        return clientConfiguration;
    }
}