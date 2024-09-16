import { CreateScheduleDto } from '../dtos/input';

export interface IScheduleService {
  create(createSchedule: CreateScheduleDto): Promise<boolean>;
}
