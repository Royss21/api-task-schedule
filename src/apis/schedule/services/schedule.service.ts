import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CreateScheduleDto } from '../dto/input';

@Injectable()
export class ScheduleService {
  private readonly _logger = new Logger(ScheduleService.name);
  constructor(private _schedulerRegistry: SchedulerRegistry) {}

  createCron(createCron: CreateScheduleDto) {
    const {
      name,
      endpointUrl,
      typeScheduleCode,
      time,
      typeTime,
      startTime,
      endTime,
      intervalMinutes,
      daysOfWeek,
    } = createCron;
    let cron = '';

    if (typeScheduleCode === '1') {
      //un tiempo es especifico
      cron =
        typeTime === 'seconds'
          ? `*/${time} * * * *`
          : typeTime === 'minutes'
            ? `* */${time} * * * *`
            : `* * */${time} * * *`;
    } else if (typeScheduleCode === '2') {
      //una hora y minuto en especifico por dias
      const [hour, minute] = time.split(':');
      cron = `* ${minute} ${hour} * * ${daysOfWeek.join(',')}`;
    } else {
      //un tiempo en especifico entre un rango de horas y minutos especificado en dias
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');
      cron = `* ${intervalMinutes} ${startMinute}-${endMinute} ${startHour}-${endHour} * * ${daysOfWeek.join(',')}`;
    }

    const cronJob = new CronJob(cron, () => {
      this._logger.log(`${name}: ${endpointUrl}`);
    });

    this._schedulerRegistry.addCronJob(name, cronJob);
    return name;
  }

  stopCron(name: string) {
    const cron = this._schedulerRegistry.getCronJob(name);
    cron.stop();
  }

  startCron(name: string) {
    const cron = this._schedulerRegistry.getCronJob(name);
    cron.start();
  }
}
