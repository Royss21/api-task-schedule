import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from './schedule.entity';
import { AuditEntity } from 'src/core/audit/audit-entity';

@Entity('type_schedule', { schema: 'config' })
export class TypeSchedule extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 30, nullable: false })
  code: string;

  @Column({ type: 'nvarchar', length: 150, nullable: false })
  name: string;

  @OneToMany(
    (): typeof Schedule => Schedule,
    (entity: Schedule): TypeSchedule => entity.typeSchedule,
  )
  schedule: Schedule[];
}
