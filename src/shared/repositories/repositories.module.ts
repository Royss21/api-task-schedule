import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule, ScheduleValue, TypeSchedule } from './unitOfWork/entities';
import {
  ScheduleRepository,
  ScheduleValueRepository,
  TypeScheduleRepository,
} from './unitOfWork/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, ScheduleValue, TypeSchedule])],
  providers: [
    ScheduleRepository,
    ScheduleValueRepository,
    TypeScheduleRepository,
  ],
  exports: [
    ScheduleRepository,
    ScheduleValueRepository,
    TypeScheduleRepository,
    TypeOrmModule,
  ],
})
export class RepositoriesModule {}
