import { Application } from '../../domain/input';

export default class UpdateScenarioRequest {
    id?: string
    description?: string
    application: Application
}
