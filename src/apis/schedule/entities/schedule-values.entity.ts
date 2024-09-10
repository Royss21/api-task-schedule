import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('cronograma_valores', { schema: 'config' })
export class ScheduleValues {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    default: '',
  })
  time: number;

  @Column({
    type: 'smallint',
    default: 0,
    nullable: true,
  })
  intervalMinutes: number;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  typeTime: string;

  @Column({
    type: 'smallint',
    default: 0,
    nullable: true,
  })
  startTime: number;

  @Column({
    type: 'smallint',
    default: 0,
    nullable: true,
  })
  endTime: number;

  @Column({
    type: 'nvarchar',
    length: 20,
    nullable: false,
    default: '',
  })
  daysOfWeek: string;
}
