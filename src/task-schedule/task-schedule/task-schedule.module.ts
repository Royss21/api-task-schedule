import { Module } from '@nestjs/common';
import { TaskScheduleService } from './task-schedule.service';

@Module({
  controllers: [],
  providers: [TaskScheduleService],
})
export class TaskScheduleModule {}
