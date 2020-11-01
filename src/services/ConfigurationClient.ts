import { Configuration } from '../domain/configuration';

export default class ConfigurationClient {
    async getConfiguration(stage: string): Promise<Configuration> {
        console.log('Implementation called');
        return new Configuration('IMP');
    }
}