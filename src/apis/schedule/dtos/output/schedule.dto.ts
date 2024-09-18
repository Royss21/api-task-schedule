import { ScheduleValueDto } from './schedule-value.dto';
import { TypeScheduleDto } from './type-schedule.dto';

export class ScheduleDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  typeScheduleId: number;
  typeSchedule: TypeScheduleDto;
  scheduleValue: ScheduleValueDto;
}
