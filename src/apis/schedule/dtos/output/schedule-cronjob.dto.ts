import { CronJobDto } from '../output/cronjob.dto';
import { ScheduleDto } from './schedule.dto';

export class ScheduleCronJobDto {
  schedule: ScheduleDto;
  cronJob: CronJobDto;

  constructor(schedule: ScheduleDto, cronjob: CronJobDto) {
    this.schedule = schedule;
    this.cronJob = cronjob;
  }
}
