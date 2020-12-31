import { ClientConfiguration } from '../../domain/configuration';

export default class UpdateConfigurationApiRequest {    
    configurationType: string;
    configuration: ClientConfiguration
}