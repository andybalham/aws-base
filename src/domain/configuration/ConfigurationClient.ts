import Configuration from './Configuration';

export default class ConfigurationClient {
    getConfiguration(stage: string): Configuration {
        console.log('Implementation called');
        return new Configuration();
    }
}