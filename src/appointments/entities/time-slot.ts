import { Personel } from "src/personel/entities/personel.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./appointment.entity";

@Entity()
export class TimeSlot {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @ManyToOne(()=>Personel, (personel)=>personel.slots)
    personel: Personel;

    @Column()
    date: string;
    
    @Column()
    from: string;
    
    @Column()
    to: string;

    @ManyToOne(()=> Appointment, (appointment)=>appointment.slots)
    appointment: Appointment;

    @Column({default: false})
    booked: boolean;
    
    
    
}