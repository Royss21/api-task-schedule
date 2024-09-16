import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeSchedule } from './type-schedule.entity';
import { ScheduleValue } from './schedule-value.entity';
import { AuditEntity } from 'src/core/audit/audit-entity';

@Entity('schedule', { schema: 'config' })
export class Schedule extends AuditEntity{
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

  @ManyToOne(
    (): typeof TypeSchedule => TypeSchedule,
    (entity: TypeSchedule): Schedule[] => entity.schedule,
  )
  @JoinColumn({ name: 'typeScheduleId' })
  typeSchedule: TypeSchedule;
  @Column({ nullable: false, type: 'int' })
  typeScheduleId: number;

  @OneToOne(
    (): typeof ScheduleValue => ScheduleValue,
    (entity: ScheduleValue): Schedule => entity.schedule,
    {
      cascade: true,
    },
  )
  scheduleValue: ScheduleValue;
}
