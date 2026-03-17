import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('CompanyEntity')
@Table('CODBEX_COMPANY')
@Documentation('Company entity mapping')
export class CompanyEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'COMPANY_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'COMPANY_NAME',
        type: 'string',
        length: 100,
    })
    public Name!: string;

    @Documentation('Manager')
    @Column({
        name: 'COMPANY_MANAGER',
        type: 'integer',
        nullable: true,
    })
    public Manager?: number;

    @Documentation('Email')
    @Column({
        name: 'COMPANY_EMAIL',
        type: 'string',
        length: 100,
    })
    public Email!: string;

    @Documentation('Phone')
    @Column({
        name: 'COMPANY_PHONE',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public Phone?: string;

    @Documentation('Address')
    @Column({
        name: 'COMPANY_ADDRESS',
        type: 'string',
        length: 200,
    })
    public Address!: string;

    @Documentation('PostCode')
    @Column({
        name: 'COMPANY_POSTCODE',
        type: 'string',
        length: 20,
    })
    public PostCode!: string;

    @Documentation('Country')
    @Column({
        name: 'COMPANY_COUNTRY',
        type: 'integer',
    })
    public Country!: number;

    @Documentation('City')
    @Column({
        name: 'COMPANY_CITY',
        type: 'integer',
    })
    public City!: number;

    @Documentation('TIN')
    @Column({
        name: 'COMPANY_TIN',
        type: 'string',
        length: 20,
        nullable: true,
    })
    public TIN?: string;

    @Documentation('IBAN')
    @Column({
        name: 'COMPANY_IBAN',
        type: 'string',
        length: 34,
        nullable: true,
    })
    public IBAN?: string;

}

(new CompanyEntity());
