import { ClientConfiguration } from '../../domain/configuration';

export default class UpdateConfigurationApiRequest {    
    configurationType: 'Client';
    configuration: ClientConfiguration
}