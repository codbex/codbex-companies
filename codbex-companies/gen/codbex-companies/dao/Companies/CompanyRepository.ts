import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface CompanyEntity {
    readonly Id: number;
    Name: string;
    Manager?: number;
    Email: string;
    Phone?: string;
    Address: string;
    PostCode: string;
    Country: number;
    City: number;
    TIN?: string;
    IBAN?: string;
}

export interface CompanyCreateEntity {
    readonly Name: string;
    readonly Manager?: number;
    readonly Email: string;
    readonly Phone?: string;
    readonly Address: string;
    readonly PostCode: string;
    readonly Country: number;
    readonly City: number;
    readonly TIN?: string;
    readonly IBAN?: string;
}

export interface CompanyUpdateEntity extends CompanyCreateEntity {
    readonly Id: number;
}

export interface CompanyEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Manager?: number | number[];
            Email?: string | string[];
            Phone?: string | string[];
            Address?: string | string[];
            PostCode?: string | string[];
            Country?: number | number[];
            City?: number | number[];
            TIN?: string | string[];
            IBAN?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Manager?: number | number[];
            Email?: string | string[];
            Phone?: string | string[];
            Address?: string | string[];
            PostCode?: string | string[];
            Country?: number | number[];
            City?: number | number[];
            TIN?: string | string[];
            IBAN?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Manager?: number;
            Email?: string;
            Phone?: string;
            Address?: string;
            PostCode?: string;
            Country?: number;
            City?: number;
            TIN?: string;
            IBAN?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Manager?: number;
            Email?: string;
            Phone?: string;
            Address?: string;
            PostCode?: string;
            Country?: number;
            City?: number;
            TIN?: string;
            IBAN?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Manager?: number;
            Email?: string;
            Phone?: string;
            Address?: string;
            PostCode?: string;
            Country?: number;
            City?: number;
            TIN?: string;
            IBAN?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Manager?: number;
            Email?: string;
            Phone?: string;
            Address?: string;
            PostCode?: string;
            Country?: number;
            City?: number;
            TIN?: string;
            IBAN?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Manager?: number;
            Email?: string;
            Phone?: string;
            Address?: string;
            PostCode?: string;
            Country?: number;
            City?: number;
            TIN?: string;
            IBAN?: string;
        };
    },
    $select?: (keyof CompanyEntity)[],
    $sort?: string | (keyof CompanyEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CompanyEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CompanyEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface CompanyUpdateEntityEvent extends CompanyEntityEvent {
    readonly previousEntity: CompanyEntity;
}

export class CompanyRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_COMPANY",
        properties: [
            {
                name: "Id",
                column: "COMPANY_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "COMPANY_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Manager",
                column: "COMPANY_MANAGER",
                type: "INTEGER",
            },
            {
                name: "Email",
                column: "COMPANY_EMAIL",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Phone",
                column: "COMPANY_PHONE",
                type: "VARCHAR",
            },
            {
                name: "Address",
                column: "COMPANY_ADDRESS",
                type: "VARCHAR",
                required: true
            },
            {
                name: "PostCode",
                column: "COMPANY_POSTCODE",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Country",
                column: "COMPANY_COUNTRY",
                type: "INTEGER",
                required: true
            },
            {
                name: "City",
                column: "COMPANY_CITY",
                type: "INTEGER",
                required: true
            },
            {
                name: "TIN",
                column: "COMPANY_TIN",
                type: "VARCHAR",
            },
            {
                name: "IBAN",
                column: "COMPANY_IBAN",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CompanyRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CompanyEntityOptions): CompanyEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): CompanyEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: CompanyCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_COMPANY",
            entity: entity,
            key: {
                name: "Id",
                column: "COMPANY_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CompanyUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_COMPANY",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "COMPANY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CompanyCreateEntity | CompanyUpdateEntity): number {
        const id = (entity as CompanyUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CompanyUpdateEntity);
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
            table: "CODBEX_COMPANY",
            entity: entity,
            key: {
                name: "Id",
                column: "COMPANY_ID",
                value: id
            }
        });
    }

    public count(options?: CompanyEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_COMPANY"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CompanyEntityEvent | CompanyUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-companies-Companies-Company", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-companies-Companies-Company").send(JSON.stringify(data));
    }
}
