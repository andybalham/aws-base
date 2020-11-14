import S3, { GetObjectRequest } from 'aws-sdk/clients/s3';

import { Configuration } from '../domain/configuration';

export default class ConfigurationRepositoryClient {
    
    constructor(private s3Client?: S3, private fileBucket?: string) {}

    async getConfiguration(): Promise<Configuration> {

        if (this.s3Client === undefined) throw new Error('this.s3Client === undefined');
        if (this.fileBucket === undefined) throw new Error('this.fileBucket === undefined');

        const fileKey = 'configuration_client.json';

        const getConfigurationParams: GetObjectRequest = {
            Bucket: this.fileBucket,
            Key: fileKey,
        };
    
        const getConfigurationResult = await this.s3Client.getObject(getConfigurationParams).promise();

        if (getConfigurationResult.Body !== undefined) {
            
            const configuration = JSON.parse(getConfigurationResult.Body.toString('utf-8'));
            return configuration;
        }

        throw new Error(`Could not load configuration for: ${JSON.stringify(getConfigurationParams)}`);
    }
}