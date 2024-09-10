import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('type_schedule', { schema: 'config' })
export class TypeSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 10, nullable: false })
  code: string;

  @Column({ type: 'nvarchar', length: 50, nullable: false })
  name: string;

  @OneToMany(() => Schedule, (entity) => entity.typeSchedule)
  schedule: Schedule[];
}
