import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { regexHour } from 'src/common/constants';
import { TypeSchedule, TypeTime } from 'src/common/enums';
import {
  CreateScheduleDto,
  SchedulePaginationDto,
  UpdateScheduleDto,
} from '../dtos/input';
import { Schedule } from '../entities';
import { ScheduleRepository, TypeScheduleRepository } from '../repositories';
import { ScheduleValueRepository } from '../repositories/schedule-value.repository';
import { IScheduleService } from './schedule.service.interface';
import { CronJobDto, ScheduleCronJobDto } from '../dtos/output';
import { PaginationOutDto } from 'src/core/dtos';
import { DataSource } from 'typeorm';
import { dbTransaction } from 'src/common/utils';

@Injectable()
export class ScheduleService implements IScheduleService {
  private readonly _logger = new Logger(ScheduleService.name);
  constructor(
    private readonly _scheduleRepository: ScheduleRepository,
    private readonly _scheduleValueRepository: ScheduleValueRepository,
    private readonly _typeScheduleRepository: TypeScheduleRepository,
    private readonly _schedulerRegistry: SchedulerRegistry,
    private readonly _dataSource: DataSource,
  ) {}

  async create(createSchedule: CreateScheduleDto): Promise<string> {
    const {
      name,
      description,
      scheduleValue: {
        urlEndpoint,
        daysOfWeek,
        typeScheduleCode,
        typeTime,
        value,
        ...restScheduleValue
      },
    } = createSchedule;

    this._validateValue(typeScheduleCode, value);

    await this._scheduleRepository.existsByUrlEndpoint(urlEndpoint);

    const typeSchedule =
      await this._typeScheduleRepository.findByCode(typeScheduleCode);

    const valueSave = [
      TypeSchedule.INTERVAL,
      TypeSchedule.INTERVAL_BETWEEN,
    ].includes(typeScheduleCode)
      ? parseInt(value).toString()
      : value;

    const typeTimeSave =
      typeScheduleCode === TypeSchedule.INTERVAL_BETWEEN
        ? TypeTime.MINUTES
        : typeScheduleCode === TypeSchedule.SPECIFIC_TIME
          ? ''
          : typeTime;

    const schedule = this._scheduleRepository.create({
      name,
      description,
      typeScheduleId: typeSchedule.id,
      scheduleValue: this._scheduleValueRepository.create({
        ...restScheduleValue,
        urlEndpoint,
        daysOfWeek: daysOfWeek?.join(','),
        value: valueSave,
        typeTime: typeTimeSave,
      }),
    });

    const scheduleSave = await this._scheduleRepository.saveSchedule(schedule);
    return scheduleSave.id;
  }

  async delete(id: string): Promise<boolean> {
    const cronJob = await this._getCronJob(id);
    if (cronJob) this._schedulerRegistry.deleteCronJob(id);

    dbTransaction(this._dataSource, async () => {
      await this._scheduleValueRepository.softDelete({ scheduleId: id });
      await this._scheduleRepository.softDelete({ id });
      return true;
    });

    return true;
  }

  async update(id: string, updateSchedule: UpdateScheduleDto): Promise<boolean> {
    console.log({ id });

    return true;
  }

  async findAll(): Promise<Schedule[]> {
    return this._scheduleRepository.findAll();
  }

  async findPaginated(
    paginationDto: SchedulePaginationDto,
  ): Promise<PaginationOutDto<ScheduleCronJobDto>> {
    const schedules =
      await this._scheduleRepository.findPaginated(paginationDto);

    const schedulesCronjob: ScheduleCronJobDto[] = [];

    for (const schedule of schedules) {
      const cronJob = await this._getCronJobMap(schedule.id);
      schedulesCronjob.push({ schedule, cronJob });
    }

    return new PaginationOutDto<ScheduleCronJobDto>(schedulesCronjob);
  }

  async findOneById(id: string): Promise<ScheduleCronJobDto> {
    const schedule = await this._scheduleRepository.findOneById(id);
    const cronJob = await this._getCronJobMap(schedule.id);
    return new ScheduleCronJobDto(schedule, cronJob);
  }

  async startSchedule(id: string): Promise<boolean> {
    const schedule = await this._scheduleRepository.findOneById(id);

    let cronJob = await this._getCronJob(schedule.id);
    if (!cronJob) cronJob = await this._createCron(schedule);

    await this._scheduleRepository.save({ ...schedule, isActive: true });
    cronJob?.start();

    return true;
  }

  async stopSchedule(id: string): Promise<boolean> {
    const schedule = await this._scheduleRepository.findOneById(id);

    let cronJob = await this._getCronJob(schedule.id);
    cronJob?.stop();
    await this._scheduleRepository.save({ ...schedule, isActive: false });

    return true;
  }

  async startBulkSchedule(): Promise<void> {
    const schedules = await this._scheduleRepository.findAllActive();

    for (const schedule of schedules) {
      this.startSchedule(schedule.id);
    }
  }

  private async _createCron(schedule: Schedule) {
    const {
      id,
      name,
      scheduleValue: {
        urlEndpoint,
        value,
        typeTime,
        startTime,
        endTime,
        daysOfWeek,
      },
      typeSchedule: { code: typeScheduleCode },
    } = schedule;
    let cron = '';

    if (typeScheduleCode === TypeSchedule.INTERVAL) {
      cron =
        typeTime === TypeTime.SECONDS
          ? `*/${value} * * * * *`
          : typeTime === TypeTime.MINUTES
            ? `0 */${value} * * * *`
            : typeTime === TypeTime.HOURS
              ? `0 */${value} * * *`
              : '* * * * *';
    } else if (typeScheduleCode === TypeSchedule.SPECIFIC_TIME) {
      const [hour, minute] = value.split(':');
      cron = `${minute} ${hour} * * ${daysOfWeek}`;
    } else if (typeScheduleCode === TypeSchedule.INTERVAL_BETWEEN) {
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');
      cron = `${value} ${startMinute}-${endMinute} ${startHour}-${endHour} * ${daysOfWeek}`;
    }

    const cronJob = new CronJob(
      cron,
      (): void => {
        this._logger.log(`${name}: ${urlEndpoint}`);
      },
      null,
      null,
      'UTC',
      null,
      false,
    );

    this._schedulerRegistry.addCronJob(id, cronJob);

    return cronJob;
  }

  private _validateValue(typeScheduleCode: TypeSchedule, value: string) {
    if (
      [TypeSchedule.INTERVAL, TypeSchedule.INTERVAL_BETWEEN].includes(
        typeScheduleCode,
      )
    ) {
      if (isNaN(+value))
        throw new BadRequestException('El valor debe ser numerico.');

      if (TypeSchedule.INTERVAL === typeScheduleCode && !(+value >= 1))
        throw new BadRequestException('El valor debe ser >= 1');

      if (
        TypeSchedule.INTERVAL_BETWEEN === typeScheduleCode &&
        !(+value >= 1 && +value <= 60)
      )
        throw new BadRequestException('El valor debe ser >= 1 y <=60 ');
    } else if (TypeSchedule.SPECIFIC_TIME === typeScheduleCode) {
      const regex = regexHour;

      if (!regex.test(value))
        throw new BadRequestException(
          `El valor debe tener el formato de hora correcto 00:00`,
        );
    }
  }

  private _getCronJob(name: string): Promise<CronJob | null> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._schedulerRegistry.getCronJob(name));
      } catch (error) {
        resolve(null);
      }
    });
  }

  private async _getCronJobMap(scheduleId: string): Promise<CronJobDto> {
    const cronJob = await this._getCronJob(scheduleId);
    return {
      running: cronJob?.running,
      lastExecution: cronJob?.lastExecution,
      runOnce: cronJob?.runOnce,
      cronTime: cronJob?.cronTime,
      nextDate: cronJob?.nextDate(),
      lastDate: cronJob?.lastDate(),
    };
  }
}
