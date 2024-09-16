import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AuditEntity {
  @CreateDateColumn({
    select: false,
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: '',
    nullable: false,
    select: false,
  })
  createdBy: string;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: '',
    nullable: false,
    select: false,
  })
  updatedBy: string;

  @DeleteDateColumn({
    select: false,
  })
  deletedAt: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: '',
    nullable: false,
    select: false,
  })
  deleteBy: string;
}
