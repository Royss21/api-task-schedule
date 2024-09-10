import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeSchedule } from './type-schedule.entity';

@Entity('cronograma', { schema: 'config' })
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    default: '',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 500,
    nullable: false,
  })
  description: string;

  @ManyToOne(() => TypeSchedule, (entity) => entity.schedule)
  @JoinColumn({
    name: 'tipo_cronograma',
  })
  typeSchedule: TypeSchedule;
  @Column({ nullable: false, name: 'tipo_cronograma', type: 'int' })
  typeScheduleId: number;

}
