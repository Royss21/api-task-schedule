import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateScheduleDto } from '../dtos/input';
import { ScheduleRepository, TypeScheduleRepository } from '../repositories';
import { ScheduleValueRepository } from '../repositories/schedule-value.repository';
import { IScheduleService } from './schedule.service.interface';
import { TypeSchedule, TypeTime } from 'src/common/enums';

@Injectable()
export class ScheduleService implements IScheduleService {
  private readonly _logger = new Logger(ScheduleService.name);
  constructor(
    private readonly _scheduleRepository: ScheduleRepository,
    private readonly _scheduleValueRepository: ScheduleValueRepository,
    private readonly _typeScheduleRepository: TypeScheduleRepository,
    //  private _schedulerRegistry: SchedulerRegistry
  ) {}

  async create(createSchedule: CreateScheduleDto): Promise<boolean> {
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
    const schedule = this._scheduleRepository.create({
      name,
      description,
      typeScheduleId: typeSchedule.id,
      scheduleValue: this._scheduleValueRepository.create({
        ...restScheduleValue,
        urlEndpoint,
        value,
        daysOfWeek: daysOfWeek?.join(','),
        typeTime:
          typeScheduleCode === TypeSchedule.INTERVAL_BETWEEN
            ? TypeTime.MINUTES
            : typeScheduleCode === TypeSchedule.SPECIFIC_TIME
              ? ''
              : typeTime,
      }),
    });

    await this._scheduleRepository.saveSchedule(schedule);
    return true;
  }

  private _validateValue(typeScheduleCode: TypeSchedule, value: string) {
    if (
      [TypeSchedule.INTERVAL_BETWEEN, TypeSchedule.INTERVAL].includes(
        typeScheduleCode,
      )
    ) {
      if (isNaN(+value))
        throw new BadRequestException('El valor debe ser numerico.');

      if (!(+value > 0 && +value <= 60))
        throw new BadRequestException('El valor debe estar entre 0 y 60');
    } else if (TypeSchedule.SPECIFIC_TIME === typeScheduleCode) {
      //validar formato de hora
    }
  }

  // createCron(createCron: CreateScheduleDto) {
  //   const {
  //     name,
  //     endpointUrl,
  //     typeScheduleCode,
  //     time,
  //     typeTime,
  //     startTime,
  //     endTime,
  //     intervalMinutes,
  //     daysOfWeek,
  //   } = createCron;
  //   let cron = '';

  //   if (typeScheduleCode === '1') {
  //     //un tiempo es especifico
  //     cron =
  //       typeTime === 'seconds'
  //         ? `*/${time} * * * *`
  //         : typeTime === 'minutes'
  //           ? `* */${time} * * * *`
  //           : `* * */${time} * * *`;
  //   } else if (typeScheduleCode === '2') {
  //     //una hora y minuto en especifico por dias
  //     const [hour, minute] = time.split(':');
  //     cron = `* ${minute} ${hour} * * ${daysOfWeek.join(',')}`;
  //   } else {
  //     //un tiempo en especifico entre un rango de horas y minutos especificado en dias
  //     const [startHour, startMinute] = startTime.split(':');
  //     const [endHour, endMinute] = endTime.split(':');
  //     cron = `* ${intervalMinutes} ${startMinute}-${endMinute} ${startHour}-${endHour} * * ${daysOfWeek.join(',')}`;
  //   }

  //   const cronJob = new CronJob(cron, () => {
  //     this._logger.log(`${name}: ${endpointUrl}`);
  //   });

  //   this._schedulerRegistry.addCronJob(name, cronJob);
  //   return name;
  // }

  // stopCron(name: string) {
  //   const cron = this._schedulerRegistry.getCronJob(name);
  //   cron.stop();
  // }

  // startCron(name: string) {
  //   const cron = this._schedulerRegistry.getCronJob(name);
  //   cron.start();
  //}
}
