import { Repository, EntityEvent, EntityConstructor, Options } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CompanyEntity } from './CompanyEntity'

@Component('CompanyRepository')
export class CompanyRepository extends Repository<CompanyEntity> {

    constructor() {
        super((CompanyEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<CompanyEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-companies-Companies-Company', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-companies-Companies-Company').send(JSON.stringify(data));
    }
}
