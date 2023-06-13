import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./service.entity";
import { Personel } from "./personel.entity";
import { Appointment } from "src/appointments/entities/appointment.entity";

@Entity()
export class Category{
    @PrimaryGeneratedColumn({type:'bigint'})
    id:number;

    @Column()
    name: string;

    @Column()
    enabled: boolean;

    @Column()
    odoo_id: number;

    @OneToMany(()=>Service, (service)=>service.category)
    services: Service[];

    @OneToMany(()=>Personel, (personel)=>personel.category)
    personel: Personel;

    @OneToMany(()=>Appointment, (appointment)=>appointment.category)
    appointments: Appointment[];

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}