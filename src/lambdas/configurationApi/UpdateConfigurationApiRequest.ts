import { ClientConfiguration } from '../../domain/configuration';

export default class UpdateConfigurationApiRequest {    
    configurationType: 'client';
    configuration: ClientConfiguration
}