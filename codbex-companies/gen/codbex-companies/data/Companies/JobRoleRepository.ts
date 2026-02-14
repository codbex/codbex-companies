import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { JobRoleEntity } from './JobRoleEntity'

@Component('JobRoleRepository')
export class JobRoleRepository extends Repository<JobRoleEntity> {

    constructor() {
        super((JobRoleEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<JobRoleEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-companies-Companies-JobRole', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-companies-Companies-JobRole').send(JSON.stringify(data));
    }
}
