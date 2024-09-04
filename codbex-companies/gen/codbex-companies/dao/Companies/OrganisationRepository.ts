import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OrganisationEntity {
    readonly Id: number;
    Name?: string;
    CostCenter?: string;
    Company?: number;
}

export interface OrganisationCreateEntity {
    readonly Name?: string;
    readonly CostCenter?: string;
    readonly Company?: number;
}

export interface OrganisationUpdateEntity extends OrganisationCreateEntity {
    readonly Id: number;
}

export interface OrganisationEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            CostCenter?: string | string[];
            Company?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            CostCenter?: string | string[];
            Company?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            CostCenter?: string;
            Company?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            CostCenter?: string;
            Company?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            CostCenter?: string;
            Company?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            CostCenter?: string;
            Company?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            CostCenter?: string;
            Company?: number;
        };
    },
    $select?: (keyof OrganisationEntity)[],
    $sort?: string | (keyof OrganisationEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OrganisationEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OrganisationEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OrganisationUpdateEntityEvent extends OrganisationEntityEvent {
    readonly previousEntity: OrganisationEntity;
}

export class OrganisationRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ORGANISATION",
        properties: [
            {
                name: "Id",
                column: "ORGANISATION_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "ORGANISATION_NAME",
                type: "VARCHAR",
            },
            {
                name: "CostCenter",
                column: "ORGANISATION_COSTCENTER",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "ORGANISATION_COMPANY",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OrganisationRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OrganisationEntityOptions): OrganisationEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OrganisationEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OrganisationCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ORGANISATION",
            entity: entity,
            key: {
                name: "Id",
                column: "ORGANISATION_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OrganisationUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ORGANISATION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ORGANISATION_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OrganisationCreateEntity | OrganisationUpdateEntity): number {
        const id = (entity as OrganisationUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OrganisationUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_ORGANISATION",
            entity: entity,
            key: {
                name: "Id",
                column: "ORGANISATION_ID",
                value: id
            }
        });
    }

    public count(options?: OrganisationEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ORGANISATION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OrganisationEntityEvent | OrganisationUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-companies-Companies-Organisation", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-companies-Companies-Organisation").send(JSON.stringify(data));
    }
}
