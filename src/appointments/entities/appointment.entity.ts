import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TimeSlot } from "./time-slot";
import { Personel } from "src/personel/entities/personel.entity";
import { User } from "src/users/entities/user.entity";
import { userInfo } from "os";
import { Category } from "src/personel/entities/category.entity";
import { Service } from "src/personel/entities/service.entity";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn({type:'bigint'})
    id:number;

    @ManyToOne(()=>Personel, (personel)=>personel.appointments)
    personel: Personel;

    @ManyToOne(()=>User, (user)=>user.appointments)
    customer: User;

    @ManyToOne(()=>Category, (category)=>category.appointments)
    category: Category;

    @ManyToOne(()=>Service, (service)=>service.appointments)
    service: Service;

    @Column({default: 'Pending'})
    status: string;

    @Column()
    remarks: string;
    
    //payment options
    @Column({ type: 'decimal', precision: 8, scale: 2 })
    price: number;

    @Column({ type: 'float' })
    longitude: number;
  
    @Column({ type: 'float' })
    latitude: number;
    
    @Column()
    landmark: string;

    @Column()
    area: string;

    @Column()
    town: string;

    @Column()
    county: string;

    @Column()
    appointmentDate: Date;

    @OneToMany(() => TimeSlot, (slot) => slot.appointment)
    slots: TimeSlot[];
}
