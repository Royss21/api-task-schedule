import {
  CreateScheduleDto,
  SchedulePaginationDto,
  UpdateScheduleDto,
} from '../dtos/input';
import { Schedule } from '../entities';
import { ScheduleCronJobDto } from '../dtos/output';
import { PaginationOutDto } from 'src/core/dtos';

export interface IScheduleService {
  create(createSchedule: CreateScheduleDto): Promise<string>;
  update(id: string, updateSchedule: UpdateScheduleDto): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Schedule[]>;
  findPaginated(
    paginationDto: SchedulePaginationDto,
  ): Promise<PaginationOutDto<ScheduleCronJobDto>>;
  findOneById(id: string): Promise<ScheduleCronJobDto>;
  startBulkSchedule(): Promise<void>;
  startSchedule(id: string): Promise<boolean>;
  stopSchedule(id: string): Promise<boolean>;
}
