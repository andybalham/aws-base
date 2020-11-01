import { Configuration } from '../domain/configuration';
import { IncomeType } from '../domain/input';

export default class ConfigurationRepositoryClient {
    async getConfiguration(stage: string): Promise<Configuration> {

        return new Configuration(new Map([
            [ IncomeType.Primary, 100],
            [ IncomeType.Other, 50],
        ]));
    }
}