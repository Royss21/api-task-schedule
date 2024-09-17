import { CreateScheduleDto } from '../dtos/input';
import { Schedule } from '../entities';

export interface IScheduleService {
  create(createSchedule: CreateScheduleDto): Promise<string>;
  findAll(): Promise<Schedule[]>;
  findOneById(id: string): Promise<Schedule>;
  startSchedule(id: string): Promise<boolean>;
  stopSchedule(id: string): Promise<boolean>;
}
