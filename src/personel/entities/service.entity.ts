import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { Personel } from "./personel.entity";
import { Appointment } from "src/appointments/entities/appointment.entity";

@Entity()
export class Service{
    @PrimaryGeneratedColumn({type:'bigint'})
    id:number;

    @Column()
    name: string;

    @Column()
    odoo_id: number

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    price: number;

    @ManyToOne(()=>Category, (category)=>category.services)
    category: Category;

    @OneToMany(()=>Personel, (personel)=>personel.service)
    personel: Personel;

    
    @OneToMany(()=>Appointment, (appointment)=>appointment.service)
    appointments: Appointment[];
    
    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}