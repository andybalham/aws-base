import S3, { GetObjectRequest } from 'aws-sdk/clients/s3';

import { ClientConfiguration } from '../domain/configuration';

export default class ConfigurationRepositoryClient {
    
    constructor(private s3Client?: S3, private fileBucket?: string) {}

    async getClientConfiguration(): Promise<ClientConfiguration> {

        if (this.s3Client === undefined) throw new Error('this.s3Client === undefined');
        if (this.fileBucket === undefined) throw new Error('this.fileBucket === undefined');

        const fileKey = 'configuration/ClientConfiguration.json';

        const getObjectRequest: GetObjectRequest = {
            Bucket: this.fileBucket,
            Key: fileKey,
        };
    
        const getObjectOutput = await this.s3Client.getObject(getObjectRequest).promise();

        if (getObjectOutput.Body !== undefined) {
            
            const clientConfiguration = JSON.parse(getObjectOutput.Body.toString('utf-8'));
            return clientConfiguration;
        }

        throw new Error(`Could not load configuration for: ${JSON.stringify(getObjectRequest)}`);
    }
}