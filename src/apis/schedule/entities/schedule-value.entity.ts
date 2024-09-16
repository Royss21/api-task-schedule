import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { AuditEntity } from 'src/core/audit/audit-entity';

@Entity('schedule_value', { schema: 'config' })
export class ScheduleValue extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  urlEndpoint: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    default: '',
  })
  value: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  typeTime: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: '',
  })
  startTime: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: '',
  })
  endTime: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    nullable: false,
    default: '',
  })
  daysOfWeek: string;

  @OneToOne(
    (): typeof Schedule => Schedule,
    (entity: Schedule): ScheduleValue => entity.scheduleValue,
  )
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;
  @Column({ nullable: false, type: 'uuid' })
  scheduleId: string;
}
