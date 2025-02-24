import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";

import { Member } from "src/members/entities/member.entity";

@Entity('identification_requests')
export class IdentificationRequest {
    
    @PrimaryGeneratedColumn('uuid', {
        name: 'uuid_identification_request',
    })
    uuid: string;

    @Column({type: 'varchar', length: 50})
    firstname: string

    @Column({type: 'varchar', length: 50})
    lastname: string

    @Column({type: 'varchar', length: 50})
    email: string

    @Column({ type: 'uuid', name: 'uuidMember' })
    uuidMember: string;

    @OneToOne(() => Member, (member) => member.identificationRequest)
    @JoinColumn({ name: 'uuidMember' })
    member: Member

}
