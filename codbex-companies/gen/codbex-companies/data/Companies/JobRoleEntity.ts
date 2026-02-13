import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('JobRoleEntity')
@Table('CODBEX_JOBROLE')
@Documentation('JobRole entity mapping')
export class JobRoleEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'JOBROLE_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'JOBROLE_NAME',
        type: 'string',
        length: 50,
        nullable: true,
    })
    public Name!: string;

    @Documentation('Company')
    @Column({
        name: 'JOBROLE_COMPANY',
        type: 'integer',
        nullable: true,
    })
    public Company?: number;

}

(new JobRoleEntity());
